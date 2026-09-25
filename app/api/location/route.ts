import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
)

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const { latitude, longitude, accuracy } = body

        if (
            typeof latitude !== "number" ||
            typeof longitude !== "number"
        ) {
            return NextResponse.json(
                { error: "Invalid location data." },
                { status: 400 }
            )
        }

        const { error } = await supabase
            .from("locations")
            .insert({
                latitude,
                longitude,
                accuracy,
            })

        if (error) {
            console.error("Supabase error:", error)

            return NextResponse.json(
                { error: "Failed to save location." },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
        })
    } catch (error) {
        console.error("Location API error:", error)

        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        )
    }
}