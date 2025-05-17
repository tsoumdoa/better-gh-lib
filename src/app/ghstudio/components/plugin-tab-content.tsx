import { TabsContent } from "@/components/ui/tabs";

export function PluginsTabContent(props: {
  // metrics: XmlMetrics;
  // setMetrics: React.Dispatch<React.SetStateAction<XmlMetrics>>;
}) {
  return (
    <div>
      <TabsContent
        value="plugins"
        className="mt-2 rounded-md bg-neutral-800 p-4"
      >
        <div className="flex flex-col gap-2">
          <div className="pb-2 font-semibold text-white">Plugins Used ()</div>
        </div>
      </TabsContent>
    </div>
  );
}
