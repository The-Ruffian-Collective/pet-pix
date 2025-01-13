import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image, style } = await req.json()
    
    // Decode base64 image
    const imageData = image.split(',')[1]
    console.log('Processing image with style:', style)

    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    // Generate style-specific prompt
    let stylePrompt = ""
    switch (style) {
      case "watercolor":
        stylePrompt = "Create a watercolor painting style portrait with soft, flowing colors"
        break
      case "oil-painting":
        stylePrompt = "Transform into a classical oil painting with rich textures"
        break
      case "pop-art":
        stylePrompt = "Convert to pop art style with bold, vibrant colors"
        break
      case "pencil-sketch":
        stylePrompt = "Create a detailed pencil sketch with elegant lines"
        break
      default:
        stylePrompt = "Create an artistic portrait"
    }

    const generatedImage = await hf.textToImage({
      inputs: `${stylePrompt} of this pet: ${imageData}`,
      model: 'black-forest-labs/FLUX.1-schnell',
    })

    console.log('Portrait generated successfully')

    const arrayBuffer = await generatedImage.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    return new Response(
      JSON.stringify({ image: `data:image/png;base64,${base64}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate portrait', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})