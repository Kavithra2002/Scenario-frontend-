import {
  SelectCompanyCard,
  CompanyDetailsGrid,
  AdjustScenariosSection,
  ScenarioOutputGrid,
} from "@/components/scenario-analysis";
import {
  DEMO_COMPANIES,
  DEMO_COMPANY_DETAILS,
  DEMO_SCENARIOS,
  DEMO_SCENARIO_OUTPUT,
} from "@/types/scenario-analysis";

export default function ScenarioAnalysisPage() {
  // Demo data for now; replace with API data when backend is ready
  const companies = DEMO_COMPANIES;
  const companyDetails = DEMO_COMPANY_DETAILS;
  const scenarios = DEMO_SCENARIOS;
  const scenarioOutput = DEMO_SCENARIO_OUTPUT;

  return (
    <div className="space-y-8">
      <SelectCompanyCard companies={companies} />

      <CompanyDetailsGrid data={companyDetails} />

      <AdjustScenariosSection scenarios={scenarios} />

      <ScenarioOutputGrid data={scenarioOutput} />
    </div>
  );
}
