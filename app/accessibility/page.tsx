"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Eye, Ear, Hand, Brain, Globe, Type, Volume2, MousePointer, Heart } from "lucide-react"
import Link from "next/link"

export default function AccessibilityPage() {
  const [fontSize, setFontSize] = useState([16])
  const [contrast, setContrast] = useState([1])
  const [reducedMotion, setReducedMotion] = useState(false)
  const [screenReader, setScreenReader] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [language, setLanguage] = useState("en")

  const accessibilityFeatures = [
    {
      icon: Eye,
      title: "Visual Accessibility",
      description: "Comprehensive support for users with visual impairments",
      features: [
        "Screen reader compatibility (NVDA, JAWS, VoiceOver)",
        "High contrast mode with customizable color schemes",
        "Adjustable font sizes from 12px to 24px",
        "Alternative text for all images and interactive elements",
        "Focus indicators and keyboard navigation",
        "Zoom support up to 400% without horizontal scrolling",
      ],
    },
    {
      icon: Ear,
      title: "Auditory Accessibility",
      description: "Features for users with hearing impairments",
      features: [
        "Closed captions for all video content",
        "Visual indicators for audio cues",
        "Transcript availability for audio content",
        "Sign language interpretation videos",
        "Adjustable audio controls and volume",
        "Visual feedback for sound-based interactions",
      ],
    },
    {
      icon: Hand,
      title: "Motor Accessibility",
      description: "Support for users with motor impairments",
      features: [
        "Full keyboard navigation support",
        "Customizable click targets (minimum 44px)",
        "Drag and drop alternatives",
        "Voice control compatibility",
        "Adjustable interaction timeouts",
        "Switch control support",
      ],
    },
    {
      icon: Brain,
      title: "Cognitive Accessibility",
      description: "Features supporting diverse cognitive needs",
      features: [
        "Clear, simple language and instructions",
        "Consistent navigation and layout",
        "Progress indicators and breadcrumbs",
        "Reduced motion options",
        "Customizable interface complexity",
        "Memory aids and help tooltips",
      ],
    },
  ]

  const complianceStandards = [
    {
      standard: "WCAG 2.1 AA",
      status: "Compliant",
      description: "Web Content Accessibility Guidelines Level AA compliance",
      details: "All content meets or exceeds WCAG 2.1 AA standards for accessibility",
    },
    {
      standard: "Section 508",
      status: "Compliant",
      description: "US Federal accessibility requirements",
      details: "Compliant with Section 508 of the Rehabilitation Act",
    },
    {
      standard: "ADA",
      status: "Compliant",
      description: "Americans with Disabilities Act compliance",
      details: "Platform design follows ADA digital accessibility guidelines",
    },
    {
      standard: "EN 301 549",
      status: "Compliant",
      description: "European accessibility standard",
      details: "Meets European EN 301 549 accessibility requirements",
    },
  ]

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "es", name: "Spanish", native: "Español" },
    { code: "fr", name: "French", native: "Français" },
    { code: "de", name: "German", native: "Deutsch" },
    { code: "zh", name: "Chinese", native: "中文" },
    { code: "ja", name: "Japanese", native: "日本語" },
    { code: "ar", name: "Arabic", native: "العربية" },
    { code: "pt", name: "Portuguese", native: "Português" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="w-px h-6 bg-border" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Accessibility Center</h1>
                  <p className="text-xs text-muted-foreground">Inclusive design for all learners</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">WCAG 2.1 AA</Badge>
              <Badge variant="outline">Universal Design</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Accessibility Commitment</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
                We believe science education should be accessible to everyone. Our platform is designed with universal
                accessibility principles to ensure all learners can engage with scientific concepts effectively.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Visual Support</h3>
                  <p className="text-sm text-muted-foreground">Screen readers, high contrast, adjustable fonts</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Ear className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Auditory Support</h3>
                  <p className="text-sm text-muted-foreground">Captions, transcripts, visual indicators</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Hand className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Motor Support</h3>
                  <p className="text-sm text-muted-foreground">Keyboard navigation, voice control, switch support</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Cognitive Support</h3>
                  <p className="text-sm text-muted-foreground">Clear instructions, consistent design, memory aids</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Our Accessibility Promise</CardTitle>
                <CardDescription>Commitment to inclusive education for all learners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Universal Design Principles</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Equitable use for people with diverse abilities</li>
                      <li>• Flexibility in use and customization</li>
                      <li>• Simple and intuitive interface design</li>
                      <li>• Perceptible information through multiple channels</li>
                      <li>• Tolerance for error with clear feedback</li>
                      <li>• Low physical effort required for interaction</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Continuous Improvement</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Regular accessibility audits and testing</li>
                      <li>• User feedback integration and response</li>
                      <li>• Collaboration with disability advocacy groups</li>
                      <li>• Staff training on accessibility best practices</li>
                      <li>• Technology updates for improved compatibility</li>
                      <li>• Community-driven accessibility enhancements</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid gap-6">
              {accessibilityFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Preferences</CardTitle>
                <CardDescription>Customize the platform to meet your specific accessibility needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Type className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold">Text & Display</h4>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Font Size: {fontSize[0]}px
                          </label>
                          <Slider
                            value={fontSize}
                            onValueChange={setFontSize}
                            max={24}
                            min={12}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Contrast: {Math.round(contrast[0] * 100)}%
                          </label>
                          <Slider
                            value={contrast}
                            onValueChange={setContrast}
                            max={2}
                            min={0.5}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-foreground">High Contrast Mode</label>
                          <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-foreground">Reduce Motion</label>
                          <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Globe className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold">Language & Localization</h4>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Interface Language</label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {lang.native} ({lang.name})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <MousePointer className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold">Interaction</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-foreground">Screen Reader Mode</label>
                          <Switch checked={screenReader} onCheckedChange={setScreenReader} />
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h5 className="font-medium mb-2 text-sm">Keyboard Shortcuts</h5>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex justify-between">
                              <span>Skip to main content</span>
                              <kbd className="bg-background px-1 rounded">Alt + M</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Open accessibility menu</span>
                              <kbd className="bg-background px-1 rounded">Alt + A</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Navigate experiments</span>
                              <kbd className="bg-background px-1 rounded">Tab / Shift + Tab</kbd>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Volume2 className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold">Audio & Video</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h5 className="font-medium mb-2 text-sm">Audio Descriptions</h5>
                          <p className="text-xs text-muted-foreground mb-2">
                            Enable detailed audio descriptions for visual content
                          </p>
                          <Switch />
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h5 className="font-medium mb-2 text-sm">Auto-play Control</h5>
                          <p className="text-xs text-muted-foreground mb-2">Prevent automatic media playback</p>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <Button>Save Preferences</Button>
                  <Button variant="outline">Reset to Defaults</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Compliance</CardTitle>
                <CardDescription>Our commitment to meeting international accessibility standards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {complianceStandards.map((standard, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{standard.standard}</h4>
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          {standard.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">{standard.description}</p>
                      <p className="text-xs text-muted-foreground">{standard.details}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accessibility Testing & Validation</CardTitle>
                <CardDescription>Continuous testing ensures ongoing compliance and usability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Automated Testing</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• axe-core accessibility engine</li>
                      <li>• WAVE web accessibility evaluation</li>
                      <li>• Lighthouse accessibility audits</li>
                      <li>• Color contrast analyzers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Manual Testing</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Screen reader testing (NVDA, JAWS)</li>
                      <li>• Keyboard-only navigation</li>
                      <li>• Voice control testing</li>
                      <li>• Mobile accessibility testing</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">User Testing</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Users with disabilities feedback</li>
                      <li>• Accessibility expert reviews</li>
                      <li>• Educational specialist input</li>
                      <li>• Continuous improvement cycles</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Accessibility Issues</CardTitle>
                <CardDescription>Help us improve accessibility for all users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Accessibility Coordinator:</strong>
                        <br />
                        accessibility@sciencelab.org
                      </p>
                      <p>
                        <strong>Phone:</strong>
                        <br />
                        +1 (555) 123-4567 (TTY available)
                      </p>
                      <p>
                        <strong>Response Time:</strong>
                        <br />
                        We respond to accessibility reports within 48 hours
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">What to Include</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Specific page or feature affected</li>
                      <li>• Description of the accessibility barrier</li>
                      <li>• Assistive technology being used</li>
                      <li>• Browser and operating system</li>
                      <li>• Steps to reproduce the issue</li>
                    </ul>
                    <Button className="mt-4">Report Issue</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
