export function MetricCard(props: {
  title: string;
  value: string | number | undefined;
}) {
  return (
    <div className="rounded-md bg-neutral-700 p-3">
      <div className="text-sm text-neutral-400">{props.title}</div>
      <div className="text-xl font-bold text-white">
        {props.value === undefined ? "-" : props.value}
      </div>
    </div>
  );
}
