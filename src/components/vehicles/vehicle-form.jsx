"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useVehicles } from "@/hooks/useVehicles"
import { Car, DollarSign, Calendar, Tag, ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"

export default function VehicleForm({ vehicleId, isEdit = false }) {
  const router = useRouter()
  const { getVehicle, createVehicle, updateVehicle, loading } = useVehicles()

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    license_plate: "",
    daily_rate: 0,
    is_available: true,
    image_url: "/placeholder.svg?height=200&width=300",
  })

  // Fetch vehicle data if in edit mode
  useEffect(() => {
    if (isEdit && vehicleId) {
      const fetchVehicle = async () => {
        const data = await getVehicle(vehicleId)
        if (data) {
          setFormData(data)
        }
      }

      fetchVehicle()
    }
  }, [isEdit, vehicleId, getVehicle])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Handle number inputs
  const handleNumberChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value) || 0,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    let result

    if (isEdit) {
      result = await updateVehicle(vehicleId, formData)
    } else {
      result = await createVehicle({
        ...formData,
        created_at: new Date().toISOString(),
      })
    }

    if (result) {
      router.push("/dashboard/vehicles")
    }
  }

  return (
    <Card className="max-w-3xl mx-auto shadow-lg border-t-4 border-t-primary">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">{isEdit ? "Edit Vehicle" : "Add New Vehicle"}</CardTitle>
        </div>
        <CardDescription>
          {isEdit
            ? "Update the details of your vehicle in the fleet inventory"
            : "Enter the details of the new vehicle to add to your fleet"}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Image Preview */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 p-4 bg-muted/50 rounded-lg">
            <div className="relative w-full max-w-[300px] h-[200px] bg-background rounded-md overflow-hidden border">
              <Image
                src={formData.image_url || "/placeholder.svg?height=200&width=300"}
                alt="Vehicle preview"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image_url" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Vehicle Image URL
                </Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/vehicle-image.jpg"
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">Enter a URL for the vehicle image or leave as default</p>
              </div>

              <div className="flex items-center space-x-2 p-3 bg-background rounded-md border">
                <Switch
                  id="is_available"
                  name="is_available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_available: checked }))}
                />
                <Label htmlFor="is_available" className="font-medium">
                  Available for Rent
                </Label>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="make" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Make
              </Label>
              <Input
                id="make"
                name="make"
                value={formData.make}
                onChange={handleChange}
                required
                placeholder="Toyota"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Model
              </Label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                placeholder="Camry"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Year
              </Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleNumberChange}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="license_plate" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                License Plate
              </Label>
              <Input
                id="license_plate"
                name="license_plate"
                value={formData.license_plate}
                onChange={handleChange}
                required
                placeholder="ABC-1234"
                className="bg-background"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="daily_rate" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Daily Rate ($)
              </Label>
              <Input
                id="daily_rate"
                name="daily_rate"
                type="number"
                step="0.01"
                value={formData.daily_rate}
                onChange={handleNumberChange}
                required
                min="0"
                placeholder="99.99"
                className="bg-background"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t bg-muted/30">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/vehicles")}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : isEdit ? (
              "Update Vehicle"
            ) : (
              "Create Vehicle"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

