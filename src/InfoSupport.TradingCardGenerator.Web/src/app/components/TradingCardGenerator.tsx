'use client';

import { useState, useEffect, useRef } from 'react';
import { useWebcam } from './useWebcam';
import { TradingCardApi, blobToBase64, base64ToDataUrl } from './api';
import { GenerateCardRequest } from './types';
import TradingCardHeader from './TradingCardHeader';
import TradingCardDisplay from './TradingCardDisplay';
import ActionButtons from './ActionButtons';
import { isVip } from './vipUtils';
import { 
  CARD_WIDTH, 
  CARD_HEIGHT, 
  CAPTURE_WIDTH, 
  CAPTURE_HEIGHT, 
  IMAGE_FORMAT, 
  IMAGE_QUALITY, 
  SPORTS, 
  LOADING_MESSAGES, 
  TEAMS,
  SPECIAL_PROPERTIES 
} from './constants';


export default function TradingCardGenerator() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCardImage, setGeneratedCardImage] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [teamColor, setTeamColor] = useState<string>();
  const [teamName, setTeamName] = useState<string>();
  const cardDisplayRef = useRef<HTMLDivElement>(null);
  const [teamLogo, setTeamLogo] = useState<string>();
  const [teamLogoBase64, setTeamLogoBase64] = useState<string>();
  const [sport, setSport] = useState<string>();
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [specialProperty, setSpecialProperty] = useState<keyof typeof SPECIAL_PROPERTIES>('none');
  const [isVipMode, setIsVipMode] = useState(false);

  const {
    videoRef,
    isStreaming,
    error,
    startWebcam,
    capturePhoto
  } = useWebcam({
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    facingMode: 'user'
  });

  const playerName = (firstName.trim() + ' ' + lastName.trim()).trim().toUpperCase() || 'PLAYER NAME';

  // Check for VIP mode when names change
  useEffect(() => {
    const isVipUser = isVip(firstName, lastName);
    setIsVipMode(isVipUser);
    
    // If VIP mode is activated, set special property to MVP
    if (isVipUser && specialProperty === 'none') {
      setSpecialProperty('mvp');
    }
  }, [firstName, lastName, specialProperty]);

  // Rotate loading messages during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setMessageIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % LOADING_MESSAGES.length;
          setLoadingMessage(LOADING_MESSAGES[newIndex]);
          return newIndex;
        });
      }, 3000); // Change message every 3 seconds
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isGenerating]);

  // On mount: pick random color and logo, start webcam
  useEffect(() => {
    const initializeTeam = async () => {
      // Pick random color
      const colors = Object.keys(TEAMS);
      const color = colors[Math.floor(Math.random() * colors.length)];
      // Pick random team from that color
      const teams = TEAMS[color as keyof typeof TEAMS].teams;
      const team = teams[Math.floor(Math.random() * teams.length)];
      // Pick random sport
      const sportKeys = Object.keys(SPORTS);
      const randomSportKey = sportKeys[Math.floor(Math.random() * sportKeys.length)];
      const randomSport = randomSportKey;
      
      setTeamColor(color);
      setTeamName(team.name);
      setTeamLogo(team.logo);
      setSport(randomSport);
      
      // Convert logo to base64 using existing utility
      try {
        const response = await fetch(`/${team.logo}`);
        const blob = await response.blob();
        const logoBase64 = await blobToBase64(blob);
        setTeamLogoBase64(logoBase64);
      } catch (error) {
        console.error('Error converting logo to base64:', error);
        setTeamLogoBase64('');
      }
    };
    
    initializeTeam();
    startWebcam();
  }, [startWebcam]);

  const handleCapturePhoto = async () => {
    setIsCapturing(true);
    setIsGenerating(true);
    setGeneratedCardImage(null); // Clear any previous result
    try {
      // Capture at optimized resolution with JPEG compression to reduce API payload size
      const blob = await capturePhoto(CAPTURE_WIDTH, CAPTURE_HEIGHT, IMAGE_FORMAT, IMAGE_QUALITY);
      if (blob) {
        await processPhoto(blob);
      }
    } catch (err) {
      console.error('Error generating trading card:', err);
      // You might want to show an error message to the user here
    } finally {
      setIsCapturing(false);
      setIsGenerating(false);
    }
  };

  const handleUploadPhoto = async (file: File) => {
    setIsGenerating(true);
    setGeneratedCardImage(null); // Clear any previous result
    try {
      await processPhoto(file);
    } catch (err) {
      console.error('Error generating trading card from uploaded image:', err);
      // You might want to show an error message to the user here
    } finally {
      setIsGenerating(false);
    }
  };

  const processPhoto = async (imageSource: Blob | File) => {
    // Convert blob/file to base64
    const base64Photo = await blobToBase64(imageSource);
    
    // Log the actual size for debugging
    const sizeInKB = (base64Photo.length * 0.75 / 1024).toFixed(2);
    console.log(`Photo processed: Base64 size: ${sizeInKB}KB`);
    
    // Store the photo for display
    const photoDataUrl = base64ToDataUrl(base64Photo);
    setCapturedPhoto(photoDataUrl);
    
    // Prepare request for C# backend
    const request: GenerateCardRequest = {
      sport: {
        type: sport ?? 'football' // Use selected sport with fallback
      },
      team: {
        name: teamName ?? 'InfoSupport',
        color: teamColor ?? 'blue',
        logo: teamLogoBase64 ?? '', // Use base64 encoded logo
      },
      player: {
        photo: base64Photo
      }
    };

    // Call the C# backend API
    const response = await TradingCardApi.generateCard(request);
    
    // Convert base64 response to data URL and display
    const cardImageDataUrl = base64ToDataUrl(response.image);
    setGeneratedCardImage(cardImageDataUrl);
  };

  const handleReset = () => {
    setGeneratedCardImage(null);
    setCapturedPhoto(null);
  };

  const handleLogoSelect = async (logoPath: string) => {
    // Find the team and color that matches the selected logo
    let selectedTeam = null;
    let selectedColor = null;
    
    for (const [color, teamGroup] of Object.entries(TEAMS)) {
      const team = teamGroup.teams.find(t => t.logo === logoPath);
      if (team) {
        selectedTeam = team;
        selectedColor = color;
        break;
      }
    }
    
    if (selectedTeam && selectedColor) {
      // Update all team-related state
      setTeamColor(selectedColor);
      setTeamName(selectedTeam.name);
      setTeamLogo(selectedTeam.logo);
      
      // Convert new logo to base64
      try {
        const response = await fetch(`/${selectedTeam.logo}`);
        const blob = await response.blob();
        const logoBase64 = await blobToBase64(blob);
        setTeamLogoBase64(logoBase64);
      } catch (error) {
        console.error('Error converting logo to base64:', error);
        setTeamLogoBase64('');
      }
    }
  };

  const handleSpecialPropertySelect = (propertyId: keyof typeof SPECIAL_PROPERTIES) => {
    setSpecialProperty(propertyId);
  };

  const handleSportSelect = (sportKey: string) => {
    setSport(sportKey);
  };

  return (
    <div>
      <TradingCardHeader 
        firstName={firstName}
        lastName={lastName}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
        teamColor={teamColor}
        error={error || undefined}
        isVipMode={isVipMode}
      />

      <TradingCardDisplay 
        ref={cardDisplayRef}
        teamColor={teamColor}
        playerName={playerName}
        teamLogo={teamLogo}
        generatedCardImage={generatedCardImage}
        isGenerating={isGenerating}
        capturedPhoto={capturedPhoto}
        loadingMessage={loadingMessage}
        messageIndex={messageIndex}
        videoRef={videoRef}
        isStreaming={isStreaming}
        onLogoSelect={handleLogoSelect}
        specialProperty={specialProperty}
        onSpecialPropertySelect={handleSpecialPropertySelect}
        selectedSport={sport}
        onSportSelect={handleSportSelect}
        isVipMode={isVipMode}
      />

      <ActionButtons 
        isStreaming={isStreaming}
        isCapturing={isCapturing}
        isGenerating={isGenerating}
        generatedCardImage={generatedCardImage}
        teamColor={teamColor}
        playerName={playerName}
        cardDisplayRef={cardDisplayRef}
        onCapturePhoto={handleCapturePhoto}
        onUploadPhoto={handleUploadPhoto}
        onReset={handleReset}
      />
    </div>
  );
}
