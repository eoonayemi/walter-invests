function investmentCompletionDate(
  investmentStartDate: Date,
  investmentDurationDays: number
): Date {
  const completionDate = new Date(
    investmentStartDate.getTime() + investmentDurationDays * 24 * 60 * 60 * 1000
  );
  return completionDate;
}

export function getCountdownString(completionDate: Date): string {
    const currentDate = new Date();
    const timeRemaining = completionDate.getTime() - currentDate.getTime();
  
    if (timeRemaining <= 0) {
      return "Investment has completed.";
    }
  
    const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutesRemaining = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    const secondsRemaining = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  
    return `${daysRemaining.toString().padStart(2, "0")} days, ${hoursRemaining
      .toString()
      .padStart(2, "0")} hours, ${minutesRemaining
      .toString()
      .padStart(2, "0")} minutes, ${secondsRemaining
      .toString()
      .padStart(2, "0")} seconds`;
  }
  
  export function countdown(
    investmentStartDate: Date,
    investmentDurationDays: number
  ): () => string {
    const completionDate = investmentCompletionDate(
      investmentStartDate,
      investmentDurationDays
    );
  
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let currentCountdownString = "";
  
    const updateCountdown = () => {
      currentCountdownString = getCountdownString(completionDate);
      if (currentCountdownString === "Investment has completed.") {
        clearInterval(intervalId!);
        intervalId = null;
      }
      return currentCountdownString;
    };
  
    return () => {
      if (intervalId === null) {
        intervalId = setInterval(updateCountdown, 1000);
      }
      return currentCountdownString || updateCountdown();
    };
  }
  