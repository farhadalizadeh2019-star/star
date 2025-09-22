import { GoogleGenAI, Modality } from "@google/genai";
import type { UploadedFile } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateVirtualTryOnImage(personImage: UploadedFile, clothingImage: UploadedFile): Promise<{ image: string | null; text: string | null }> {
  try {
    const model = 'gemini-2.5-flash-image-preview';

    const personImagePart = {
      inlineData: {
        data: personImage.base64,
        mimeType: personImage.mimeType,
      },
    };

    const clothingImagePart = {
      inlineData: {
        data: clothingImage.base64,
        mimeType: clothingImage.mimeType,
      },
    };

    const textPart = {
      text: 'Take the clothing from the second image and realistically place it on the person from the first image. The final image should be a high-quality, photorealistic depiction of the person wearing the garment. Only return the final edited image, do not return the original person image.',
    };

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [personImagePart, clothingImagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    let generatedImage: string | null = null;
    let generatedText: string | null = null;

    if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];

        if (candidate.finishReason && candidate.finishReason !== 'STOP') {
             if (candidate.finishReason === 'SAFETY') {
                throw new Error("The request was blocked for safety reasons. Please try different images.");
             }
             throw new Error(`Image generation stopped unexpectedly. Reason: ${candidate.finishReason}`);
        }
        
        for (const part of candidate.content.parts) {
            if (part.inlineData) {
                generatedImage = part.inlineData.data;
            } else if (part.text) {
                generatedText = part.text;
            }
        }
    }
    
    if (!generatedImage) {
        throw new Error("API did not return an image. The model may have been unable to process the request.");
    }

    return { image: generatedImage, text: generatedText };

  } catch (error) {
    console.error('Error generating image with Gemini API:', error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('Failed to generate image. Please check the console for more details.');
  }
}