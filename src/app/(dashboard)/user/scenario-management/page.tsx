import { ScenarioManagementContent } from "@/components/scenario-management";
import {
  DEMO_COMPANIES,
  DEMO_SCENARIOS,
} from "@/types/scenario-analysis";

export default function ScenarioManagementPage() {
  // When backend is ready: fetch companies, existing scenarios, recommended scenarios
  const companies = DEMO_COMPANIES;
  const existingScenarios = DEMO_SCENARIOS;
  const recommendedScenarios = [] as typeof DEMO_SCENARIOS;

  return (
    <ScenarioManagementContent
      companies={companies}
      existingScenarios={existingScenarios}
      recommendedScenarios={recommendedScenarios}
    />
  );
}
