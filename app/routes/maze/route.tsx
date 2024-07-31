import { differenceInMilliseconds } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Page, PageHeader, PageHeading } from "~/components/layout";
import { Button, H1, H2, H4 } from "~/components/ui";
import { cn } from "~/components/utils";

const MazePage = () => {
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [completionTime, setCompletionTime] = useState(0);
  const [hasTorch, setHasTorch] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const [hasButton1, setHasButton1] = useState(false);
  const [hasButton2, setHasButton2] = useState(false);
  const [hasButton3, setHasButton3] = useState(false);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (!isRunning && seconds !== 0) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, seconds]);

  useEffect(() => {
    const pos = document.documentElement;
    if (!hasTorch) {
      var start = document.getElementById("start");
      pos.style.setProperty("--x", (start?.offsetLeft ?? 0) + 32 + "px");
      pos.style.setProperty("--y", (start?.offsetTop ?? 0) + 32 + "px");
      return;
    }

    const follow = (e: MouseEvent) => {
      pos.style.setProperty("--x", e.layerX + "px");
      pos.style.setProperty("--y", e.layerY + "px");
    };

    pos.addEventListener("mousemove", follow);

    return () => {
      pos.removeEventListener("mousemove", follow);
    };
  }, [hasTorch]);

  function onStartGame() {
    if (hasTorch || isRunning) {
      return;
    }
    setHasTorch(true);
    setIsRunning(true);
    setStartDate(new Date());
  }

  function onLeaveArea() {
    setHasTorch(false);
    setHasButton1(false);
    setHasButton2(false);
    setHasButton3(false);
    resetTimer();
  }

  function resetTimer() {
    setSeconds(0);
    setIsRunning(false);
    clearInterval(intervalRef.current);
  }

  function completeGame() {
    if (
      !hasButton1 ||
      !hasButton2 ||
      !hasButton3 ||
      !isRunning ||
      !hasTorch ||
      seconds < 5
    ) {
      return;
    }
    setGameCompleted(true);
    const diffInMilliseconds =
      differenceInMilliseconds(new Date(), startDate) / 1000;
    setCompletionTime(diffInMilliseconds);
    onLeaveArea();
  }

  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <H1>Maze (WIP)</H1>
        </PageHeading>
      </PageHeader>

      <div className="glass dark:dark-glass relative flex w-full flex-col items-center justify-center gap-4">
        {gameCompleted && (
          <div className="absolute top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-1">
            <div className="flex animate-bounce flex-col text-center">
              <H1>Game Complete</H1>
              <H2>Time: {completionTime}</H2>
            </div>
          </div>
        )}
        <div className="absolute left-4 top-4 z-10 flex w-fit flex-col items-start justify-start gap-2">
          <H2>Time: {seconds}</H2>
          <H4
            className={
              hasButton1
                ? "text-green-500 dark:text-green-500"
                : "text-red-500 dark:text-red-500"
            }
          >
            Switch 1: {hasButton1 ? "On" : "Off"}
          </H4>
          <H4
            className={
              hasButton2
                ? "text-green-500 dark:text-green-500"
                : "text-red-500 dark:text-red-500"
            }
          >
            Switch 2: {hasButton2 ? "On" : "Off"}
          </H4>
          <H4
            className={
              hasButton3
                ? "text-green-500 dark:text-green-500"
                : "text-red-500 dark:text-red-500"
            }
          >
            Switch 3: {hasButton3 ? "On" : "Off"}
          </H4>
          <H4
            className={
              hasButton1 && hasButton2 && hasButton3
                ? "text-green-500 dark:text-green-500"
                : "text-red-500 dark:text-red-500"
            }
          >
            Exit: {hasButton1 && hasButton2 && hasButton3 ? "Open" : "Closed"}
          </H4>
        </div>
        <div
          className={`${isRunning ? "hover:cursor-move" : "hover:cursor-crosshair"} flex w-full flex-col items-center justify-center`}
          onMouseLeave={onLeaveArea}
        >
          {bricks.map((row, i) => (
            <div
              key={i}
              className="flex w-full items-center justify-center gap-0"
            >
              {row.map((cell, j) => (
                <div key={j} className="h-16 w-16">
                  {cell === 0 && <Wall onMouseEnter={onLeaveArea} />}
                  {cell === 1 && <Path />}
                  {cell === 2 && <Start onMouseEnter={onStartGame} />}
                  {cell === 3 && <Goal onMouseEnter={completeGame} />}
                  {cell === 4 && (
                    <Switch
                      onMouseEnter={() => setHasButton1(true)}
                      hasCollected={hasButton1}
                    />
                  )}
                  {cell === 5 && (
                    <Switch
                      onMouseEnter={() => setHasButton2(true)}
                      hasCollected={hasButton2}
                    />
                  )}
                  {cell === 6 && (
                    <Switch
                      onMouseEnter={() => setHasButton3(true)}
                      hasCollected={hasButton3}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        {!gameCompleted && (
          <div
            id="blackout"
            style={{
              position: "fixed",
              top: "0px",
              left: "0px",
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              background:
                "radial-gradient(circle at var(--x) var(--y) , transparent 20px, rgba(0,0,0,1) 52px)",
            }}
          />
        )}
      </div>
    </Page>
  );
};

function Wall({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-16 w-16 bg-gray-500", className)} {...props} />;
}
function Path({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("h-16 w-16 bg-yellow-500", className)} {...props} />
  );
}
function Start({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      id="start"
      className={cn("h-16 w-16 bg-orange-500", className)}
      {...props}
    />
  );
}
function Goal({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-16 w-16 bg-red-500", className)} {...props} />;
}

interface SwitchProps extends React.HTMLAttributes<HTMLButtonElement> {
  hasCollected: boolean;
}
function Switch({ className, hasCollected, ...props }: SwitchProps) {
  return (
    <Button
      variant="unstyled"
      className={cn(
        `h-16 w-16 rounded-none ${
          hasCollected ? "bg-yellow-500" : "animate-pulse bg-green-500"
        }`,
        className,
      )}
      {...props}
    />
  );
}

export default MazePage;

const bricks = [
  [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 1, 4, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 6, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 5, 1, 1, 0, 0, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
];

// 0 = wall
// 1 = path
// 2 = start
// 3 = end
// 4 5 6 = buttons
