"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Globe, BookOpen, Eye, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const missionValues = [
    {
      icon: Heart,
      title: "Educational Equity",
      description:
        "Every student deserves access to high-quality science education, regardless of economic circumstances or geographic location.",
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Breaking down barriers through technology, making advanced science education available worldwide.",
    },
    {
      icon: Eye,
      title: "Inclusive Design",
      description:
        "Universal accessibility ensuring all learners, including those with disabilities, can engage with scientific concepts.",
    },
    {
      icon: Lightbulb,
      title: "Innovation in Education",
      description: "Leveraging cutting-edge technology to create immersive, effective learning experiences.",
    },
  ]

  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Executive Director",
      background: "Former NASA scientist with 15 years in space research and education advocacy",
      expertise: "Astrophysics, Educational Policy",
    },
    {
      name: "Prof. Michael Chen",
      role: "Chief Academic Officer",
      background: "MIT Professor specializing in educational technology and virtual learning environments",
      expertise: "EdTech Research, Curriculum Design",
    },
    {
      name: "Dr. Aisha Patel",
      role: "Director of Accessibility",
      background: "Disability rights advocate and accessibility technology expert",
      expertise: "Universal Design, Assistive Technology",
    },
    {
      name: "Maria Rodriguez",
      role: "Chief Financial Officer",
      background: "Former non-profit CFO with expertise in educational funding and transparency",
      expertise: "Non-Profit Finance, Grant Management",
    },
  ]

  const milestones = [
    {
      year: "2020",
      title: "Foundation Established",
      description: "ScienceLab Educational Platform founded as 501(c)(3) non-profit organization",
    },
    {
      year: "2021",
      title: "First Experiments Launched",
      description: "Initial physics and chemistry experiments released to pilot schools",
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Platform translated into 8 languages, reaching 25 countries",
    },
    {
      year: "2023",
      title: "Accessibility Certification",
      description: "Achieved WCAG 2.1 AA compliance and accessibility recognition",
    },
    {
      year: "2024",
      title: "500,000 Students Milestone",
      description: "Reached half a million students across 1,200+ educational institutions",
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
                  <h1 className="text-lg font-bold text-foreground">About Our Mission</h1>
                  <p className="text-xs text-muted-foreground">Democratizing science education worldwide</p>
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

      <main id="main-content" className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h2 className="text-4xl font-bold text-foreground mb-6">Transforming Science Education</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            We are a non-profit organization dedicated to making high-quality science education accessible to every
            student, everywhere. Through innovative virtual laboratory experiences, we're breaking down barriers and
            creating opportunities for scientific discovery.
          </p>
        </section>

        {/* Mission & Values */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide every decision we make and every feature we develop
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {missionValues.map((value, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <value.icon className="w-5 h-5 text-primary" />
                    </div>
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-pretty">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Impact Statistics */}
        <section className="py-16 bg-muted/30 -mx-4 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">Our Impact</h3>
              <p className="text-lg text-muted-foreground">Measurable outcomes from our educational mission</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">500,000+</div>
                  <p className="text-sm text-muted-foreground">Students Reached</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">1,200+</div>
                  <p className="text-sm text-muted-foreground">Educational Institutions</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">45</div>
                  <p className="text-sm text-muted-foreground">Countries Served</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">98%</div>
                  <p className="text-sm text-muted-foreground">User Satisfaction</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Leadership Team</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experienced educators, researchers, and advocates leading our mission
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription className="font-medium text-primary">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{member.background}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.split(", ").map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Our Journey</h3>
            <p className="text-lg text-muted-foreground">
              Key milestones in our mission to democratize science education
            </p>
          </div>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">{milestone.year}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-foreground mb-2">{milestone.title}</h4>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-foreground mb-4">Join Our Mission</h3>
            <p className="text-lg text-muted-foreground mb-8">
              Help us continue expanding access to quality science education for students worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/support">
                <Button size="lg">
                  <Heart className="w-5 h-5 mr-2" />
                  Support Our Work
                </Button>
              </Link>
              <Link href="/institutional">
                <Button variant="outline" size="lg">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Partner With Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
