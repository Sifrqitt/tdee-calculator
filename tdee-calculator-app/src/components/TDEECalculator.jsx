import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const TDEECalculator = () => {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [bodyFat, setBodyFat] = useState("");
  const [goal, setGoal] = useState("maintenance");
  const [tdee, setTdee] = useState(null);
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fats: 0 });
  const [useLbs, setUseLbs] = useState(false);
  const [error, setError] = useState("");

  const activityLevels = useMemo(() => ({
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    heavy: 1.725,
    athlete: 1.9,
  }), []);

  const goalAdjustments = useMemo(() => ({
    maintenance: 1.0,
    "fat loss": 0.8,
    "muscle gain": 1.2,
  }), []);

  const handleNumberChange = (setter) => (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value >= 0) setter(value);
  };

  const calculateTDEE = () => {
    setError("");
    const missingFields = [];
    if (!weight) missingFields.push("Weight");
    if (bodyFat === "" && !height) missingFields.push("Height");
    if (bodyFat === "" && !age) missingFields.push("Age");
    if (!activityLevel) missingFields.push("Activity Level");
    if (!goal) missingFields.push("Goal");

    if (missingFields.length > 0) {
      setError(`Please enter: ${missingFields.join(", ")}`);
      return;
    }

    const parsedWeight = parseFloat(weight) / (useLbs ? 2.20462 : 1);
    const parsedHeight = parseFloat(height);
    const parsedAge = parseFloat(age);
    const parsedBodyFat = bodyFat !== "" ? parseFloat(bodyFat) : null;

    let bmr;
    if (parsedBodyFat && parsedBodyFat > 0 && parsedBodyFat < 100) {
      const leanMass = parsedWeight * (1 - parsedBodyFat / 100);
      bmr = 370 + 21.6 * leanMass;
    } else {
      bmr = gender === "male"
        ? 10 * parsedWeight + 6.25 * parsedHeight - 5 * parsedAge + 5
        : 10 * parsedWeight + 6.25 * parsedHeight - 5 * parsedAge - 161;
    }

    const calculatedTDEE = bmr * activityLevels[activityLevel] * goalAdjustments[goal];
    setTdee(calculatedTDEE);

    setMacros({
      protein: (calculatedTDEE * 0.3) / 4,
      carbs: (calculatedTDEE * 0.4) / 4,
      fats: (calculatedTDEE * 0.3) / 9,
    });
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white">
      <Card className="w-full max-w-lg p-4 shadow-lg rounded-2xl">
        <CardContent>
          <h2 className="text-xl font-bold text-center mb-4">TDEE Calculator</h2>
          <div className="grid gap-4">
            <label className="block font-medium">Weight ({useLbs ? "lbs" : "kg"})</label>
            <Switch checked={useLbs} onCheckedChange={() => setUseLbs((prev) => !prev)} />
            <Input type="number" value={weight} onChange={handleNumberChange(setWeight)} />

            {bodyFat === "" && (
              <>
                <label className="block font-medium">Height (cm)</label>
                <Input type="number" value={height} onChange={handleNumberChange(setHeight)} />
              </>
            )}

            {bodyFat === "" && (
              <>
                <label className="block font-medium">Age (years)</label>
                <Input type="number" value={age} onChange={handleNumberChange(setAge)} />
              </>
            )}

            <label className="block font-medium">Body Fat % (optional)</label>
            <Input type="number" value={bodyFat} onChange={handleNumberChange(setBodyFat)} />

            {bodyFat === "" && (
              <>
                <label className="block font-medium">Gender</label>
                <div className="flex space-x-4">
                  <Button variant={gender === "male" ? "default" : "outline"} onClick={() => setGender("male")}>
                    Male
                  </Button>
                  <Button variant={gender === "female" ? "default" : "outline"} onClick={() => setGender("female")}>
                    Female
                  </Button>
                </div>
              </>
            )}

            <label className="block font-medium">Activity Level</label>
            <Select value={activityLevel} onValueChange={setActivityLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Activity Level" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(activityLevels).map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label className="block font-medium">Goal</label>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger>
                <SelectValue placeholder="Goal" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(goalAdjustments).map((goalKey) => (
                  <SelectItem key={goalKey} value={goalKey}>
                    {goalKey.charAt(0).toUpperCase() + goalKey.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={calculateTDEE}>Calculate TDEE</Button>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            {tdee && (
              <div className="text-center text-lg mt-4">
                TDEE: {tdee.toFixed(2)} kcal/day<br />
                Protein: {macros.protein.toFixed(1)}g, Carbs: {macros.carbs.toFixed(1)}g, Fats: {macros.fats.toFixed(1)}g
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TDEECalculator;
