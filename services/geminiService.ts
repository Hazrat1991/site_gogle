// AI Service Disabled
import { Product, AIRecommendation } from '../types';

export const getProductRecommendations = async (
  userQuery: string,
  allProducts: Product[],
  lang: 'ru' | 'tj' = 'ru'
): Promise<AIRecommendation> => {
  return { message: "AI Disabled", productIds: [] };
};