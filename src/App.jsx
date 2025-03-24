import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function App() {
  const [ackNumber, setAckNumber] = useState("")
  const [year, setYear] = useState("2025")
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setResults(null)

    if (!ackNumber.trim()) {
      setError("Please enter an acknowledgment number")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`https://cyber-backend-y4p5.onrender.com/api/case/${year}/${ackNumber}`)
      const data = await response.json()

      if (response.ok) {
        setResults(data)
      } else {
        setError(data.error || "No records found")
      }
    } catch (error) {
      setError("Failed to fetch data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Case Information Lookup</CardTitle>
          <CardDescription>Enter the acknowledgment number to retrieve case details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              
              <div className="space-y-2">
                <Label htmlFor="ackNumber">Acknowledgment Number (Last 5 digits)</Label>
                <Input
                  id="ackNumber"
                  placeholder="Enter last 5 digits of Ack. No."
                  value={ackNumber}
                  onChange={(e) => setAckNumber(e.target.value)}
                  maxLength={5}
                />
              </div>
               <div className="space-y-2 h-20">
                <Label htmlFor="year">Select Year</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="w-full bg-white border-1 z-50">
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <Button type="submit" className="w-full bg-blue-500 text-white" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching Data...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </form>

          {results && (
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Case Details:</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {Object.entries(results).map(([key, value]) => (
                      <tr key={key} className="border-b last:border-b-0">
                        <td className="px-4 py-2 font-medium bg-gray-50 w-1/3">
                          {key}
                        </td>
                        <td className="px-4 py-2 w-2/3">
                          {value || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            For assistance, please contact the helpdesk
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
