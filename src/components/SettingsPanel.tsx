import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, X, Volume2, VolumeX, Mic, Globe, Palette, 
  Trash2, Download, Moon, Sun, Zap, User, Bell, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeType, themeNames, themes } from "@/hooks/useTheme";

export interface JarvisSettings {
  voiceEnabled: boolean;
  voiceSpeed: number;
  voicePitch: number;
  voiceId: string;
  language: string;
  colorTheme: ThemeType;
  notificationsEnabled: boolean;
  soundEffects: boolean;
  autoSpeak: boolean;
  userName: string;
}

const defaultSettings: JarvisSettings = {
  voiceEnabled: true,
  voiceSpeed: 1,
  voicePitch: 1,
  voiceId: '',
  language: 'en-US',
  colorTheme: 'jarvis',
  notificationsEnabled: true,
  soundEffects: true,
  autoSpeak: true,
  userName: 'Sir',
};

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: JarvisSettings;
  onSettingsChange: (settings: JarvisSettings) => void;
  onClearConversation: () => void;
  onExportConversation: () => void;
  onThemeChange?: (theme: ThemeType) => void;
  availableVoices?: SpeechSynthesisVoice[];
  onVoiceChange?: (voice: SpeechSynthesisVoice | null) => void;
}

const SettingsPanel = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onClearConversation,
  onExportConversation,
  onThemeChange,
  availableVoices = [],
  onVoiceChange,
}: SettingsPanelProps) => {
  const [localSettings, setLocalSettings] = useState<JarvisSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const updateSetting = <K extends keyof JarvisSettings>(
    key: K,
    value: JarvisSettings[K]
  ) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);

    // Handle theme change
    if (key === 'colorTheme' && onThemeChange) {
      onThemeChange(value as ThemeType);
    }
  };

  const themeOptions: Array<{ value: ThemeType; label: string; colors: string[] }> = [
    { value: 'jarvis', label: 'JARVIS', colors: ['hsl(190 100% 50%)', 'hsl(35 100% 55%)'] },
    { value: 'ironman', label: 'Iron Man', colors: ['hsl(0 85% 55%)', 'hsl(35 100% 60%)'] },
    { value: 'ultron', label: 'Ultron', colors: ['hsl(0 0% 60%)', 'hsl(0 85% 50%)'] },
    { value: 'vision', label: 'Vision', colors: ['hsl(280 80% 60%)', 'hsl(55 90% 55%)'] },
    { value: 'friday', label: 'F.R.I.D.A.Y', colors: ['hsl(210 100% 55%)', 'hsl(280 60% 55%)'] },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-primary/20 z-50 shadow-2xl"
            style={{
              boxShadow: "-10px 0 50px hsl(var(--primary) / 0.1)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Settings</h2>
                  <p className="text-xs text-muted-foreground">Customize JARVIS</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-primary"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Settings Content */}
            <ScrollArea className="h-[calc(100%-80px)]">
              <div className="p-4 md:p-6 space-y-6">
                {/* Voice Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-medium text-foreground">Voice Settings</h3>
                  </div>
                  
                  <div className="space-y-4 pl-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="voice-enabled" className="text-sm text-muted-foreground">
                        Voice Output
                      </Label>
                      <Switch
                        id="voice-enabled"
                        checked={localSettings.voiceEnabled}
                        onCheckedChange={(checked) => updateSetting('voiceEnabled', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-speak" className="text-sm text-muted-foreground">
                        Auto-speak Responses
                      </Label>
                      <Switch
                        id="auto-speak"
                        checked={localSettings.autoSpeak}
                        onCheckedChange={(checked) => updateSetting('autoSpeak', checked)}
                      />
                    </div>

                    {/* Voice Selector */}
                    {availableVoices.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Voice</Label>
                        <Select
                          value={localSettings.voiceId || ''}
                          onValueChange={(value) => {
                            updateSetting('voiceId', value);
                            const voice = availableVoices.find(v => v.voiceURI === value);
                            onVoiceChange?.(voice || null);
                          }}
                        >
                          <SelectTrigger className="w-full bg-muted/50 border-primary/20">
                            <SelectValue placeholder="Select voice" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {availableVoices
                              .filter(v => v.lang.startsWith('en'))
                              .map((voice) => (
                                <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                                  <span className="flex items-center gap-2">
                                    <span>{voice.name}</span>
                                    <span className="text-xs text-muted-foreground">({voice.lang})</span>
                                  </span>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted-foreground">Speech Speed</Label>
                        <span className="text-xs text-primary">{localSettings.voiceSpeed.toFixed(1)}x</span>
                      </div>
                      <Slider
                        value={[localSettings.voiceSpeed]}
                        onValueChange={([value]) => updateSetting('voiceSpeed', value)}
                        min={0.5}
                        max={2}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted-foreground">Voice Pitch</Label>
                        <span className="text-xs text-primary">{localSettings.voicePitch.toFixed(1)}</span>
                      </div>
                      <Slider
                        value={[localSettings.voicePitch]}
                        onValueChange={([value]) => updateSetting('voicePitch', value)}
                        min={0.5}
                        max={1.5}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-primary/10" />

                {/* Language Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-medium text-foreground">Language</h3>
                  </div>
                  
                  <div className="pl-6">
                    <Select
                      value={localSettings.language}
                      onValueChange={(value) => updateSetting('language', value)}
                    >
                      <SelectTrigger className="w-full bg-muted/50 border-primary/20">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-IN">English (India)</SelectItem>
                        <SelectItem value="hi-IN">Hindi</SelectItem>
                        <SelectItem value="es-ES">Spanish</SelectItem>
                        <SelectItem value="fr-FR">French</SelectItem>
                        <SelectItem value="de-DE">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="bg-primary/10" />

                {/* Appearance */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-medium text-foreground">Appearance</h3>
                  </div>
                  
                  <div className="space-y-4 pl-6">
                    <div className="space-y-3">
                      <Label className="text-sm text-muted-foreground">Color Theme</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {themeOptions.map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() => updateSetting('colorTheme', theme.value)}
                            className={`
                              flex items-center gap-2 p-3 rounded-lg border transition-all
                              ${localSettings.colorTheme === theme.value
                                ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                : 'border-muted hover:border-primary/30 hover:bg-muted/50'
                              }
                            `}
                          >
                            <div className="flex gap-1">
                              {theme.colors.map((color, i) => (
                                <div
                                  key={i}
                                  className="w-4 h-4 rounded-full"
                                  style={{ 
                                    backgroundColor: color,
                                    boxShadow: `0 0 10px ${color}`,
                                  }}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-medium">{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="sound-effects" className="text-sm text-muted-foreground">
                        Sound Effects
                      </Label>
                      <Switch
                        id="sound-effects"
                        checked={localSettings.soundEffects}
                        onCheckedChange={(checked) => updateSetting('soundEffects', checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-primary/10" />

                {/* Notifications */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-medium text-foreground">Notifications</h3>
                  </div>
                  
                  <div className="pl-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications" className="text-sm text-muted-foreground">
                        Enable Notifications
                      </Label>
                      <Switch
                        id="notifications"
                        checked={localSettings.notificationsEnabled}
                        onCheckedChange={(checked) => updateSetting('notificationsEnabled', checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-primary/10" />

                {/* Data & Privacy */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-medium text-foreground">Data & Privacy</h3>
                  </div>
                  
                  <div className="space-y-3 pl-6">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 border-primary/20 hover:bg-primary/10"
                      onClick={onExportConversation}
                    >
                      <Download className="w-4 h-4" />
                      Export Conversation
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 border-destructive/20 text-destructive hover:bg-destructive/10"
                      onClick={onClearConversation}
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All Conversations
                    </Button>
                  </div>
                </div>

                {/* About */}
                <div className="mt-8 p-4 rounded-lg bg-muted/30 border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-secondary" />
                    <span className="text-xs text-muted-foreground">JARVIS v2.0</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Just A Rather Very Intelligent System • Powered by Stark Industries
                  </p>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export { SettingsPanel, defaultSettings };
