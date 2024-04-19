import { PropsWithChildren, useEffect, useRef, useState } from "react";

const chances = [true, false, false];

export const PixelGlass: React.FC<PropsWithChildren> = ({ children }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (divRef.current) {
      console.log(divRef.current.offsetHeight);
      setWidth(divRef.current.offsetWidth);
      setHeight(divRef.current.offsetHeight);
    }
  }, [divRef]);

  const noOfPixelsInRow = Math.floor(width / 16);
  const noOfRows = Math.floor(height / 4);
  console.log("noOfRows", noOfRows);

  function createRow() {
    const row: JSX.Element[] = [];
    for (let i = 0; i < noOfPixelsInRow; i++) {
      const randomIndex = Math.floor(Math.random() * chances.length);
      const isPixeled = chances[randomIndex];

      row.push(
        <div
          className={`${
            isPixeled ? "bg-transparent" : "glass dark:dark-glass"
          } h-4 max-h-4 min-h-4 w-4 min-w-4 max-w-4`}
        />,
      );
    }
    return row;
  }

  const rows: JSX.Element[][] = [];
  for (let i = 0; i < noOfRows; i++) {
    const row = createRow();
    rows.push(row);
  }

  return (
    <div className="relative flex w-full">
      <div className="glass dark:dark-glass flex w-full items-center rounded-l-lg pl-4">
        {children}
      </div>
      <div
        className="h-full min-h-full w-24 min-w-24 overflow-hidden"
        ref={divRef}
      >
        <div className="flex">{createRow()}</div>
        <div className="flex">{createRow()}</div>
        <div className="flex">{createRow()}</div>
        <div className="flex">{createRow()}</div>
        <div className="flex">{createRow()}</div>
        <div className="flex">{createRow()}</div>
      </div>
    </div>
  );
};
