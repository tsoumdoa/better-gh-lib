import { TabsContent } from "@/components/ui/tabs";
import { PluginLibraryType } from "@/types/subs/library-type-schema";

export function PluginsTabContent(props: {
  plugins: PluginLibraryType[] | undefined;
}) {
  if (props.plugins && props.plugins.length === 0)
    return (
      <div>
        <TabsContent
          value="plugins"
          className="mt-2 rounded-md bg-neutral-800 p-4"
        >
          <div className="flex flex-col gap-1">
            <div className="pb-1 font-semibold text-white">No plugins used</div>
          </div>
        </TabsContent>
      </div>
    );
  return (
    <div>
      <TabsContent
        value="plugins"
        className="mt-2 rounded-md bg-neutral-800 p-4"
      >
        <div className="flex flex-col gap-1">
          <div className="pb-1 font-semibold text-white">Plugins Used</div>
          <ul className="font-regular text-white">
            {props.plugins?.map((p) => (
              <li className="pl-2" key={p.name}>
                {p.name} ({p.version})
              </li>
            ))}
          </ul>
        </div>
      </TabsContent>
    </div>
  );
}
