"use client";
import { useState } from "react";
import { useXmlPaste } from "../../hooks/use-xml-paste";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GhXmlValidatorButtons } from "@/app/components/paste-ghxml";
import { ValidatedResult } from "@/app/components/valiation-resul";
import { SummaryTabContent } from "./summary-tab-content";
import { PluginsTabContent } from "./plugin-tab-content";
import { ComponentsTabContent } from "./component-tab-content";
import posthog from "posthog-js";

export default function GhXmlStudio() {
  const [error, setError] = useState("");
  //for now
  console.log(error);

  const {
    run,
    isValidXml,
    handlePasteFromClipboard,
    handleClear,
    validatedJson,
    metrics,
  } = useXmlPaste(setError, () => {});
  //temp hack ...

  return (
    <div className="w-full max-w-3xl">
      <Card className="border-neutral-800 bg-neutral-900">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-3xl font-semibold text-white">
              GhXML Studio
            </span>
            <div className="flex gap-2">
              {run && (
                <ValidatedResult
                  isValidXml={isValidXml}
                  validatedJson={validatedJson}
                  schemaCoverage={undefined}
                />
              )}
              <GhXmlValidatorButtons
                handlePasteFromClipboard={handlePasteFromClipboard}
                handleClear={handleClear}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Tabs defaultValue="summary" className="w-full gap-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="summary"
                  onClick={() => posthog.capture("user_clicked_studio_summary")}
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value="plugins"
                  onClick={() => posthog.capture("user_clicked_plugin_list")}
                >
                  Plugins List
                </TabsTrigger>
                <TabsTrigger
                  value="components"
                  onClick={() => posthog.capture("user_clicked_component_list")}
                >
                  Component Usage
                </TabsTrigger>
              </TabsList>
              <SummaryTabContent metrics={metrics} />
              <PluginsTabContent plugins={metrics?.plugins || undefined} />
              <ComponentsTabContent
                data={metrics?.uniqueComponents || undefined}
              />
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
