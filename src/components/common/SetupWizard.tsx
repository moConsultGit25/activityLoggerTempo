import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Phone,
  Mail,
  MessageSquare,
  Mic,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useEngagementSourcesContext } from "@/contexts/EngagementSourcesContext";
import PhoneTabContent from "../dashboard/tabs/PhoneTabContent";
import EmailTabContent from "../dashboard/tabs/EmailTabContent";
import SocialTabContent from "../dashboard/tabs/SocialTabContent";
import RecordingTabContent from "../dashboard/tabs/RecordingTabContent";

type SetupWizardProps = {
  onComplete: () => void;
};

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSources, setSelectedSources] = useState<{
    phone: boolean;
    email: boolean;
    social: boolean;
    recording: boolean;
  }>({
    phone: false,
    email: false,
    social: false,
    recording: false,
  });

  const { sourceStatus } = useEngagementSourcesContext();

  const steps = [
    {
      title: "Select Sources",
      description: "Choose which engagement sources you want to connect",
    },
    {
      title: "Configure Sources",
      description: "Set up your selected engagement sources",
    },
    {
      title: "Complete Setup",
      description: "Your engagement sources are ready to use",
    },
  ];

  const handleSourceToggle = (source: keyof typeof selectedSources) => {
    setSelectedSources((prev) => ({
      ...prev,
      [source]: !prev[source],
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  const anySourceSelected = Object.values(selectedSources).some(
    (selected) => selected,
  );
  const anySourceConnected = Object.values(sourceStatus).some(
    (status) => status === "connected",
  );

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle>Engagement Sources Setup Wizard</CardTitle>
        <CardDescription>{steps[currentStep].description}</CardDescription>
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${index > 0 ? "ml-2" : ""}`}
            >
              <div
                className={`rounded-full w-8 h-8 flex items-center justify-center ${
                  index <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 w-12 ${index < currentStep ? "bg-primary" : "bg-muted"}`}
                />
              )}
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {currentStep === 0 && (
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={selectedSources.phone ? "default" : "outline"}
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => handleSourceToggle("phone")}
            >
              <Phone className="h-8 w-8" />
              <span>Phone System</span>
            </Button>
            <Button
              variant={selectedSources.email ? "default" : "outline"}
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => handleSourceToggle("email")}
            >
              <Mail className="h-8 w-8" />
              <span>Email</span>
            </Button>
            <Button
              variant={selectedSources.social ? "default" : "outline"}
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => handleSourceToggle("social")}
            >
              <MessageSquare className="h-8 w-8" />
              <span>Social Media</span>
            </Button>
            <Button
              variant={selectedSources.recording ? "default" : "outline"}
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => handleSourceToggle("recording")}
            >
              <Mic className="h-8 w-8" />
              <span>Recording Apps</span>
            </Button>
          </div>
        )}

        {currentStep === 1 && (
          <Tabs
            defaultValue={
              Object.keys(selectedSources).find(
                (key) => selectedSources[key as keyof typeof selectedSources],
              ) || "phone"
            }
            className="w-full"
          >
            <TabsList
              className="grid w-full"
              style={{
                gridTemplateColumns: `repeat(${Object.values(selectedSources).filter(Boolean).length}, 1fr)`,
              }}
            >
              {selectedSources.phone && (
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Phone
                </TabsTrigger>
              )}
              {selectedSources.email && (
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </TabsTrigger>
              )}
              {selectedSources.social && (
                <TabsTrigger value="social" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Social
                </TabsTrigger>
              )}
              {selectedSources.recording && (
                <TabsTrigger
                  value="recording"
                  className="flex items-center gap-2"
                >
                  <Mic className="h-4 w-4" /> Recording
                </TabsTrigger>
              )}
            </TabsList>

            {selectedSources.phone && (
              <TabsContent value="phone">
                <PhoneTabContent />
              </TabsContent>
            )}
            {selectedSources.email && (
              <TabsContent value="email">
                <EmailTabContent />
              </TabsContent>
            )}
            {selectedSources.social && (
              <TabsContent value="social">
                <SocialTabContent />
              </TabsContent>
            )}
            {selectedSources.recording && (
              <TabsContent value="recording">
                <RecordingTabContent />
              </TabsContent>
            )}
          </Tabs>
        )}

        {currentStep === 2 && (
          <div className="text-center py-8">
            <div className="rounded-full bg-green-100 text-green-600 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-medium mb-2">Setup Complete!</h3>
            <p className="text-muted-foreground mb-4">
              Your engagement sources are now configured and ready to use. You
              can manage them anytime from the Engagement Sources panel.
            </p>
            <div className="flex flex-col gap-2">
              {selectedSources.phone && (
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Phone System
                  </div>
                  <div className="text-sm font-medium">
                    {sourceStatus.phone === "connected"
                      ? "Connected"
                      : "Not Connected"}
                  </div>
                </div>
              )}
              {selectedSources.email && (
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </div>
                  <div className="text-sm font-medium">
                    {sourceStatus.email === "connected"
                      ? "Connected"
                      : "Not Connected"}
                  </div>
                </div>
              )}
              {selectedSources.social && (
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Social Media
                  </div>
                  <div className="text-sm font-medium">
                    {sourceStatus.social === "connected"
                      ? "Connected"
                      : "Not Connected"}
                  </div>
                </div>
              )}
              {selectedSources.recording && (
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4" /> Recording Apps
                  </div>
                  <div className="text-sm font-medium">
                    {sourceStatus.recording === "connected"
                      ? "Connected"
                      : "Not Connected"}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={currentStep === 0 && !anySourceSelected}
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleFinish}>
            Finish <Check className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SetupWizard;
