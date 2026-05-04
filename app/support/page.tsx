"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Heart,
  DollarSign,
  Users,
  BookOpen,
  Award,
  Globe,
  FileText,
  Mail,
  Phone,
  MessageCircle,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"

export default function SupportPage() {
  const donationTiers = [
    {
      amount: "$25",
      title: "Student Supporter",
      description: "Supports one student's access for a month",
      impact: "Provides platform access for 1 student",
      popular: false,
    },
    {
      amount: "$100",
      title: "Classroom Champion",
      description: "Supports an entire classroom for a month",
      impact: "Enables 30 students to access experiments",
      popular: true,
    },
    {
      amount: "$500",
      title: "School Sponsor",
      description: "Supports a small school for a semester",
      impact: "Provides access for 150 students for 6 months",
      popular: false,
    },
    {
      amount: "$2,500",
      title: "Education Advocate",
      description: "Funds new experiment development",
      impact: "Develops one new virtual experiment",
      popular: false,
    },
  ]

  const impactStats = [
    { number: "500,000+", label: "Students Reached", icon: Users },
    { number: "1,200+", label: "Schools Served", icon: BookOpen },
    { number: "45", label: "Countries", icon: Globe },
    { number: "98%", label: "Satisfaction Rate", icon: Award },
  ]

  const supportChannels = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email with detailed responses",
      contact: "support@sciencelab.org",
      response: "24-48 hours",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Real-time assistance during business hours",
      contact: "Available 9 AM - 5 PM EST",
      response: "Immediate",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support team",
      contact: "+1 (555) 123-4567",
      response: "Business hours",
    },
    {
      icon: HelpCircle,
      title: "Help Center",
      description: "Comprehensive documentation and tutorials",
      contact: "help.sciencelab.org",
      response: "Self-service",
    },
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
                  <h1 className="text-lg font-bold text-foreground">Support Our Mission</h1>
                  <p className="text-xs text-muted-foreground">Help make science education accessible to all</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">501(c)(3)</Badge>
              <Badge variant="outline">Non-Profit</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="donate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="donate">Donate</TabsTrigger>
            <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
            <TabsTrigger value="help">Get Help</TabsTrigger>
            <TabsTrigger value="transparency">Transparency</TabsTrigger>
          </TabsList>

          <TabsContent value="donate" className="space-y-6">
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Support Science Education</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
                Your donation helps us provide free and affordable access to high-quality science education worldwide.
                Every contribution directly impacts students and educators.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {impactStats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">{stat.number}</h3>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {donationTiers.map((tier, index) => (
                <Card key={index} className={tier.popular ? "border-primary ring-2 ring-primary/20" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">{tier.amount}</CardTitle>
                      {tier.popular && <Badge>Most Popular</Badge>}
                    </div>
                    <CardTitle className="text-lg">{tier.title}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-foreground mb-2">Impact:</p>
                      <p className="text-sm text-muted-foreground">{tier.impact}</p>
                    </div>
                    <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                      <DollarSign className="w-4 h-4 mr-2" />
                      Donate {tier.amount}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Custom Donation</CardTitle>
                <CardDescription>Choose your own amount to support our mission</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Donation Amount</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 border-input rounded-l-md">
                        $
                      </span>
                      <Input type="number" placeholder="100" className="rounded-l-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Donation Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select donation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one-time">One-time donation</SelectItem>
                        <SelectItem value="monthly">Monthly recurring</SelectItem>
                        <SelectItem value="annual">Annual recurring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-6">
                  <Button size="lg" className="w-full md:w-auto">
                    <Heart className="w-4 h-4 mr-2" />
                    Make Donation
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Deductibility</CardTitle>
                <CardDescription>Your donation is tax-deductible to the full extent allowed by law</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">501(c)(3) Status</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      ScienceLab Educational Platform is a registered 501(c)(3) non-profit organization.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Tax ID:</strong> 12-3456789
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Donation Receipt</h4>
                    <p className="text-sm text-muted-foreground">
                      You will receive an official donation receipt via email immediately after your contribution for
                      tax purposes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volunteer" className="space-y-6">
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Volunteer With Us</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
                Join our community of educators, developers, and science enthusiasts working to make quality education
                accessible worldwide.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Content Creation
                  </CardTitle>
                  <CardDescription>Help develop educational content and experiments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                    <li>• Write experiment instructions</li>
                    <li>• Create educational videos</li>
                    <li>• Develop assessment questions</li>
                    <li>• Review scientific accuracy</li>
                  </ul>
                  <Button variant="outline" className="w-full bg-transparent">
                    Apply to Create Content
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Community Support
                  </CardTitle>
                  <CardDescription>Help other educators and students succeed</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                    <li>• Answer community questions</li>
                    <li>• Moderate discussion forums</li>
                    <li>• Provide technical support</li>
                    <li>• Mentor new educators</li>
                  </ul>
                  <Button variant="outline" className="w-full bg-transparent">
                    Join Community Team
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Translation
                  </CardTitle>
                  <CardDescription>Make content accessible in multiple languages</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                    <li>• Translate interface text</li>
                    <li>• Localize educational content</li>
                    <li>• Review translations</li>
                    <li>• Cultural adaptation</li>
                  </ul>
                  <Button variant="outline" className="w-full bg-transparent">
                    Become a Translator
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Volunteer Application</CardTitle>
                <CardDescription>Tell us about your interests and how you'd like to contribute</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                      <Input placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                      <Input type="email" placeholder="your.email@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Areas of Interest</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your primary interest" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="content">Content Creation</SelectItem>
                        <SelectItem value="community">Community Support</SelectItem>
                        <SelectItem value="translation">Translation</SelectItem>
                        <SelectItem value="development">Software Development</SelectItem>
                        <SelectItem value="design">Design & UX</SelectItem>
                        <SelectItem value="outreach">Outreach & Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Experience & Background</label>
                    <Textarea
                      placeholder="Tell us about your relevant experience, skills, and why you want to volunteer with us..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Time Commitment</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="How much time can you contribute?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 hours per week</SelectItem>
                        <SelectItem value="3-5">3-5 hours per week</SelectItem>
                        <SelectItem value="6-10">6-10 hours per week</SelectItem>
                        <SelectItem value="10+">10+ hours per week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Submit Volunteer Application</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Get Support</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
                We're here to help you succeed with our platform. Choose the support option that works best for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {supportChannels.map((channel, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <channel.icon className="w-5 h-5 text-primary" />
                      </div>
                      {channel.title}
                    </CardTitle>
                    <CardDescription>{channel.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Contact:</span>
                        <span className="font-medium">{channel.contact}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Response Time:</span>
                        <span className="font-medium">{channel.response}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">How do I access the virtual experiments?</h4>
                    <p className="text-sm text-muted-foreground">
                      Simply navigate to the Experiments page and click on any experiment to begin. No special software
                      installation is required - everything runs in your web browser.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Is the platform really free for schools?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! We offer free access to Title I schools and reduced pricing for institutions with limited
                      budgets. Our mission is to make science education accessible to all.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">What technical requirements do I need?</h4>
                    <p className="text-sm text-muted-foreground">
                      You need a modern web browser (Chrome, Firefox, Safari, or Edge), at least 4GB RAM, and a stable
                      internet connection. The platform works on computers, tablets, and smartphones.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transparency" className="space-y-6">
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Financial Transparency</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
                As a non-profit organization, we believe in complete transparency about how we use donations and manage
                our resources.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Program Services</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">85%</div>
                  <p className="text-sm text-muted-foreground">
                    Platform development, content creation, and direct educational services
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Administrative</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">10%</div>
                  <p className="text-sm text-muted-foreground">
                    Organizational management, legal compliance, and governance
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Fundraising</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">5%</div>
                  <p className="text-sm text-muted-foreground">
                    Donor outreach, grant writing, and fundraising activities
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Annual Reports & Financial Statements</CardTitle>
                <CardDescription>Access our complete financial records and impact reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Available Documents</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <FileText className="w-4 h-4 mr-2" />
                        2024 Annual Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <FileText className="w-4 h-4 mr-2" />
                        2024 Financial Statements
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <FileText className="w-4 h-4 mr-2" />
                        IRS Form 990 (2023)
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <FileText className="w-4 h-4 mr-2" />
                        Impact Measurement Report
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Organizational Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Legal Name:</span>
                        <span>ScienceLab Educational Platform Inc.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax ID (EIN):</span>
                        <span>12-3456789</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Founded:</span>
                        <span>2020</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GuideStar Rating:</span>
                        <span>Platinum Seal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Charity Navigator:</span>
                        <span>4 Stars</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Board of Directors</CardTitle>
                <CardDescription>Meet the leaders guiding our mission</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">Dr. Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground mb-1">Board Chair</p>
                    <p className="text-xs text-muted-foreground">Former NASA Scientist, Education Advocate</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">Prof. Michael Chen</h4>
                    <p className="text-sm text-muted-foreground mb-1">Vice Chair</p>
                    <p className="text-xs text-muted-foreground">MIT Professor, EdTech Researcher</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">Maria Rodriguez</h4>
                    <p className="text-sm text-muted-foreground mb-1">Treasurer</p>
                    <p className="text-xs text-muted-foreground">Former CFO, Non-Profit Financial Expert</p>
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
