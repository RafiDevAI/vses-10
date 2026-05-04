"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarNav } from "@/components/sidebar-nav"
import { AppHeader } from "@/components/app-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CalculatorPage() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [newNumber, setNewNumber] = useState(true)

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num)
      setNewNumber(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay("0.")
      setNewNumber(false)
    } else if (!display.includes(".")) {
      setDisplay(display + ".")
    }
  }

  const handleOperation = (op: string) => {
    const currentValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(currentValue)
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation)
      setDisplay(String(result))
      setPreviousValue(result)
    }

    setOperation(op)
    setNewNumber(true)
  }

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case "+":
        return prev + current
      case "-":
        return prev - current
      case "×":
        return prev * current
      case "÷":
        return prev / current
      case "^":
        return Math.pow(prev, current)
      default:
        return current
    }
  }

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const currentValue = Number.parseFloat(display)
      const result = calculate(previousValue, currentValue, operation)
      setDisplay(String(result))
      setPreviousValue(null)
      setOperation(null)
      setNewNumber(true)
    }
  }

  const handleClear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setNewNumber(true)
  }

  const handleScientific = (func: string) => {
    const value = Number.parseFloat(display)
    let result: number

    switch (func) {
      case "sin":
        result = Math.sin(value * (Math.PI / 180))
        break
      case "cos":
        result = Math.cos(value * (Math.PI / 180))
        break
      case "tan":
        result = Math.tan(value * (Math.PI / 180))
        break
      case "log":
        result = Math.log10(value)
        break
      case "ln":
        result = Math.log(value)
        break
      case "sqrt":
        result = Math.sqrt(value)
        break
      case "x²":
        result = value * value
        break
      case "1/x":
        result = 1 / value
        break
      case "π":
        result = Math.PI
        break
      case "e":
        result = Math.E
        break
      default:
        result = value
    }

    setDisplay(String(result))
    setNewNumber(true)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block">
        <SidebarNav />
      </div>

      <div className="flex-1 flex flex-col">
        <AppHeader />

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Scientific Calculator</h2>
              <p className="text-muted-foreground">
                Perform basic and advanced mathematical calculations for your experiments
              </p>
            </div>

            <Tabs defaultValue="scientific" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="scientific">Scientific</TabsTrigger>
                <TabsTrigger value="basic">Basic</TabsTrigger>
              </TabsList>

              <TabsContent value="scientific">
                <Card>
                  <CardHeader>
                    <CardTitle>Scientific Calculator</CardTitle>
                    <CardDescription>Advanced mathematical functions for scientific calculations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted p-6 rounded-lg text-right">
                        <div className="text-4xl font-mono font-bold break-all">{display}</div>
                        {operation && (
                          <div className="text-sm text-muted-foreground mt-2">
                            {previousValue} {operation}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-5 gap-2">
                        <Button variant="outline" onClick={() => handleScientific("sin")}>
                          sin
                        </Button>
                        <Button variant="outline" onClick={() => handleScientific("cos")}>
                          cos
                        </Button>
                        <Button variant="outline" onClick={() => handleScientific("tan")}>
                          tan
                        </Button>
                        <Button variant="outline" onClick={() => handleScientific("log")}>
                          log
                        </Button>
                        <Button variant="outline" onClick={() => handleScientific("ln")}>
                          ln
                        </Button>

                        <Button variant="outline" onClick={() => handleScientific("π")}>
                          π
                        </Button>
                        <Button variant="outline" onClick={() => handleScientific("e")}>
                          e
                        </Button>
                        <Button variant="outline" onClick={() => handleScientific("x²")}>
                          x²
                        </Button>
                        <Button variant="outline" onClick={() => handleOperation("^")}>
                          x^y
                        </Button>
                        <Button variant="outline" onClick={() => handleScientific("sqrt")}>
                          √
                        </Button>

                        <Button variant="secondary" onClick={handleClear}>
                          C
                        </Button>
                        <Button variant="outline" onClick={() => handleScientific("1/x")}>
                          1/x
                        </Button>
                        <Button variant="outline" onClick={() => handleOperation("÷")}>
                          ÷
                        </Button>
                        <Button variant="outline" onClick={() => handleOperation("×")}>
                          ×
                        </Button>
                        <Button variant="outline" onClick={() => handleOperation("-")}>
                          -
                        </Button>

                        <Button onClick={() => handleNumber("7")}>7</Button>
                        <Button onClick={() => handleNumber("8")}>8</Button>
                        <Button onClick={() => handleNumber("9")}>9</Button>
                        <Button variant="outline" onClick={() => handleOperation("+")}>
                          +
                        </Button>
                        <Button variant="outline" onClick={() => handleNumber("(")} disabled>
                          (
                        </Button>

                        <Button onClick={() => handleNumber("4")}>4</Button>
                        <Button onClick={() => handleNumber("5")}>5</Button>
                        <Button onClick={() => handleNumber("6")}>6</Button>
                        <Button className="row-span-2" variant="default" onClick={handleEquals}>
                          =
                        </Button>
                        <Button variant="outline" onClick={() => handleNumber(")")} disabled>
                          )
                        </Button>

                        <Button onClick={() => handleNumber("1")}>1</Button>
                        <Button onClick={() => handleNumber("2")}>2</Button>
                        <Button onClick={() => handleNumber("3")}>3</Button>
                        <Button variant="outline" onClick={() => setDisplay(display.slice(0, -1) || "0")}>
                          ←
                        </Button>

                        <Button className="col-span-2" onClick={() => handleNumber("0")}>
                          0
                        </Button>
                        <Button onClick={handleDecimal}>.</Button>
                        <Button variant="outline" onClick={() => setDisplay(String(-Number.parseFloat(display)))}>
                          +/-
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Calculator</CardTitle>
                    <CardDescription>Simple arithmetic operations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted p-6 rounded-lg text-right">
                        <div className="text-4xl font-mono font-bold break-all">{display}</div>
                        {operation && (
                          <div className="text-sm text-muted-foreground mt-2">
                            {previousValue} {operation}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        <Button variant="secondary" onClick={handleClear}>
                          C
                        </Button>
                        <Button variant="outline" onClick={() => setDisplay(display.slice(0, -1) || "0")}>
                          ←
                        </Button>
                        <Button variant="outline" onClick={() => setDisplay(String(-Number.parseFloat(display)))}>
                          +/-
                        </Button>
                        <Button variant="outline" onClick={() => handleOperation("÷")}>
                          ÷
                        </Button>

                        <Button onClick={() => handleNumber("7")}>7</Button>
                        <Button onClick={() => handleNumber("8")}>8</Button>
                        <Button onClick={() => handleNumber("9")}>9</Button>
                        <Button variant="outline" onClick={() => handleOperation("×")}>
                          ×
                        </Button>

                        <Button onClick={() => handleNumber("4")}>4</Button>
                        <Button onClick={() => handleNumber("5")}>5</Button>
                        <Button onClick={() => handleNumber("6")}>6</Button>
                        <Button variant="outline" onClick={() => handleOperation("-")}>
                          -
                        </Button>

                        <Button onClick={() => handleNumber("1")}>1</Button>
                        <Button onClick={() => handleNumber("2")}>2</Button>
                        <Button onClick={() => handleNumber("3")}>3</Button>
                        <Button variant="outline" onClick={() => handleOperation("+")}>
                          +
                        </Button>

                        <Button className="col-span-2" onClick={() => handleNumber("0")}>
                          0
                        </Button>
                        <Button onClick={handleDecimal}>.</Button>
                        <Button className="bg-primary text-primary-foreground" onClick={handleEquals}>
                          =
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
