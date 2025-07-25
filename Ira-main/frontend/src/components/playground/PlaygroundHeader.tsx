import { Button } from "@/components/button/Button";
import { LoadingSVG } from "@/components/button/LoadingSVG";

import { useConfig } from "@/hooks/useConfig";
import { ConnectionState, LocalParticipant } from "livekit-client";
import { ReactNode } from "react";
import { MicIcon, MicOffIcon, CameraIcon, CameraOffIcon, ChatIcon, PhoneIcon, ScreenShareIcon } from "./icons";
import { useLocalParticipant } from "@livekit/components-react";

type PlaygroundHeader = {
  logo?: ReactNode;
  title?: ReactNode;
  githubLink?: string;
  height: number;
  accentColor: string;
  connectionState: ConnectionState;
  onConnectClicked: () => void;
  onChatToggle?: () => void;
};

export const PlaygroundHeader = ({
  logo,
  title,
  githubLink,
  accentColor,
  height,
  onConnectClicked,
  connectionState,
  onChatToggle,
}: PlaygroundHeader) => {
  const { config, setUserSettings } = useConfig();
  const { localParticipant } = useLocalParticipant();
  
  const toggleMicrophone = async () => {
    if (localParticipant instanceof LocalParticipant) {
      const enabled = !localParticipant.isMicrophoneEnabled;
      await localParticipant.setMicrophoneEnabled(enabled);
      
      // Update settings
      setUserSettings({
        ...config.settings,
        inputs: {
          ...config.settings.inputs,
          mic: enabled
        }
      });
    }
  };

  const toggleCamera = async () => {
    if (localParticipant instanceof LocalParticipant) {
      const enabled = !localParticipant.isCameraEnabled;
      await localParticipant.setCameraEnabled(enabled);
      
      // Update settings
      setUserSettings({
        ...config.settings,
        inputs: {
          ...config.settings.inputs,
          camera: enabled
        }
      });
    }
  };

  const toggleScreenShare = async () => {
    if (localParticipant instanceof LocalParticipant) {
      const enabled = !localParticipant.isScreenShareEnabled;
      try {
        await localParticipant.setScreenShareEnabled(enabled);
        
        // Update settings if needed
        setUserSettings({
          ...config.settings,
          inputs: {
            ...config.settings.inputs,
            screenShare: enabled
          }
        });
      } catch (error) {
        console.error('Failed to toggle screen share:', error);
      }
    }
  };

  const toggleChat = () => {
    // Update settings
    setUserSettings({
      ...config.settings,
      chat: !config.settings.chat
    });
    
    if (onChatToggle) {
      onChatToggle();
    }
  };

  const isConnected = connectionState === ConnectionState.Connected;
  const isConnecting = connectionState === ConnectionState.Connecting;
  
  return (
    <div
      className="flex gap-4 pt-4 justify-between items-center shrink-0"
      style={{
        height: height + "px",
      }}
    >
      <div className="flex items-center gap-3 basis-1/3 min-w-0">
        {logo}
        <div className="lg:text-center text-base lg:text-xl lg:font-semibold text-white truncate">
          {title || "Ira AI"}
        </div>
      </div>
      <div className="flex items-center basis-1/3 justify-center">
        {isConnecting && (
          <div className="flex items-center gap-2 text-white text-sm">
            <LoadingSVG diameter={16} strokeWidth={2} />
            <span>Connecting...</span>
          </div>
        )}
      </div>
      <div className="flex basis-1/3 justify-end items-center gap-2 shrink-0">
        {isConnected && (
          <>
            <Button 
              accentColor={localParticipant?.isMicrophoneEnabled ? accentColor : "gray"}
              onClick={toggleMicrophone}
              className="shrink-0 bg-gray-800 hover:bg-opacity-80"
              variant="icon"
            >
              {localParticipant?.isMicrophoneEnabled ? <MicIcon /> : <MicOffIcon />}
            </Button>
            
            <Button 
              accentColor={localParticipant?.isCameraEnabled ? accentColor : "gray"}
              onClick={toggleCamera}
              className="shrink-0 bg-gray-800 hover:bg-opacity-80"
              variant="icon"
            >
              {localParticipant?.isCameraEnabled ? <CameraIcon /> : <CameraOffIcon />}
            </Button>

            <Button 
              accentColor={localParticipant?.isScreenShareEnabled ? accentColor : "gray"}
              onClick={toggleScreenShare}
              className="shrink-0 bg-gray-800 hover:bg-opacity-80"
              variant="icon"
            >
              <ScreenShareIcon />
            </Button>
            
            <Button 
              accentColor={config.settings.chat ? accentColor : "gray"}
              onClick={toggleChat}
              className="shrink-0 bg-gray-800 hover:bg-opacity-80"
              variant="icon"
            >
              <ChatIcon />
            </Button>
          </>
        )}

        {githubLink && (
          <a
            href={githubLink}
            target="_blank"
            className="text-white hover:text-white/80 shrink-0"
          >
            <GithubSVG />
          </a>
        )}
        
        <Button
          accentColor={isConnected ? "red" : "green"}
          disabled={isConnecting}
          onClick={onConnectClicked}
          className="shrink-0 bg-gray-800 hover:bg-opacity-80"
          variant="icon"
        >
          {isConnecting ? <LoadingSVG /> : <PhoneIcon />}
        </Button>
      </div>
    </div>
  );
};

const LKLogo = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_101_119699)">
      <path
        d="M19.2006 12.7998H12.7996V19.2008H19.2006V12.7998Z"
        fill="currentColor"
      />
      <path
        d="M25.6014 6.40137H19.2004V12.8024H25.6014V6.40137Z"
        fill="currentColor"
      />
      <path
        d="M25.6014 19.2002H19.2004V25.6012H25.6014V19.2002Z"
        fill="currentColor"
      />
      <path d="M32 0H25.599V6.401H32V0Z" fill="currentColor" />
      <path d="M32 25.5986H25.599V31.9996H32V25.5986Z" fill="currentColor" />
      <path
        d="M6.401 25.599V19.2005V12.7995V6.401V0H0V6.401V12.7995V19.2005V25.599V32H6.401H12.7995H19.2005V25.599H12.7995H6.401Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_101_119699">
        <rect width="32" height="32" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const GithubSVG = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 98 96"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
      fill="currentColor"
    />
  </svg>
);
