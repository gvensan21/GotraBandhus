import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import FeatureGrid from "@/components/FeatureGrid";
import VisualizationPreview from "@/components/VisualizationPreview";

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <FeatureGrid />
      <VisualizationPreview />
    </Layout>
  );
}
