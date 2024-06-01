/*--------------------------------------------navbar--------------------------------------------------- */


let hamMenuIcon = document.getElementById("ham-menu");
let navBar = document.getElementById("nav-bar");
let navLinks = navBar.querySelectorAll("li");
hamMenuIcon.addEventListener("click", () => {
  navBar.classList.toggle("active");
  hamMenuIcon.classList.toggle("fa-times");
});
navLinks.forEach((navLinks) => {
  navLinks.addEventListener("click", () => {
    navBar.classList.remove("active");
    hamMenuIcon.classList.toggle("fa-times");
  });
});

/*--------------------------------------------workoutPlan--------------------------------------------------- */
class WorkoutNode {
  constructor(id, type, duration, calories, date) {
      this.id = id;
      this.type = type;
      this.duration = duration;
      this.calories = calories;
      this.date = date;
      this.next = null;
  }
}

class WorkoutLinkedList {
  constructor() {
      this.head = null;
      this.id = 0; // Unique identifier for workouts
      this.feedbackMessage = document.getElementById("feedback-message");
  }

  addWorkout(type, duration, calories, date) {
      const newWorkout = new WorkoutNode(++this.id, type, duration, calories, date);
      if (!this.head) {
          this.head = newWorkout;
      } else {
          let current = this.head;
          while (current.next) {
              current = current.next;
          }
          current.next = newWorkout;
      }
      this.displayWorkouts();
      this.displayFeedback("Workout added successfully.", "success");
  }

  deleteWorkout(id) {
      if (!this.head) return;

      let deletedWorkout = null;

      if (this.head.id === id) {
          deletedWorkout = this.head;
          this.head = this.head.next;
      } else {
          let current = this.head;
          while (current.next) {
              if (current.next.id === id) {
                  deletedWorkout = current.next;
                  current.next = current.next.next;
                  break;
              }
              current = current.next;
          }
      }

      if (deletedWorkout) {
          this.displayWorkouts();
          this.displayFeedback("Workout deleted successfully.", "success1");
      } else {
          this.displayFeedback("Failed to delete workout.", "error");
      }
  }

  editWorkout(id, newType, newDuration, newCalories, newDate) {
      let current = this.head;
      while (current) {
          if (current.id === id) {
              current.type = newType;
              current.duration = newDuration;
              current.calories = newCalories;
              current.date = newDate;
              break;
          }
          current = current.next;
      }
      this.displayWorkouts();
      this.displayFeedback("Workout edited successfully.", "success");
  }

  sortByDate() {
      if (!this.head || !this.head.next) {
          return;
      }

      let sorted = false;
      while (!sorted) {
          sorted = true;
          let current = this.head;
          while (current.next) {
              if (new Date(current.date) > new Date(current.next.date)) {
                  let temp = current.date;
                  current.date = current.next.date;
                  current.next.date = temp;

                  temp = current.type;
                  current.type = current.next.type;
                  current.next.type = temp;

                  temp = current.duration;
                  current.duration = current.next.duration;
                  current.next.duration = temp;

                  temp = current.calories;
                  current.calories = current.next.calories;
                  current.next.calories = temp;

                  temp = current.id;
                  current.id = current.next.id;
                  current.next.id = temp;
                  sorted = false;
              }
              current = current.next;
          }
      }
      this.displayWorkouts();
  }

  displayWorkouts() {
      const list = document.getElementById('workout-list');
      list.innerHTML = ''; // Clear existing entries

      let current = this.head;
      while (current !== null) {
          const item = document.createElement('li');
          item.innerHTML = `
              ${current.type} - ${current.duration} minutes - ${current.calories} calories - ${current.date}
              <button onclick="workoutList.deleteWorkout(${current.id})">Delete</button>
              <button onclick="workoutList.editWorkoutPrompt(${current.id})">Edit</button>
          `;
          list.appendChild(item);
          current = current.next;
      }
  }

  editWorkoutPrompt(id) {
      const exercise = prompt("Enter the new exercise type:");
      const duration = prompt("Enter the new duration:");
      const calories = prompt("Enter the new calories burned:");
      const date = prompt("Enter the new date (YYYY-MM-DD):");

      this.editWorkout(id, exercise, duration, calories, date);
  }

  displayFeedback(message, type) {
      this.feedbackMessage.textContent = message;
      this.feedbackMessage.className = "feedback-message " + type;
      this.feedbackMessage.style.display = "block";

      setTimeout(() => {
          this.feedbackMessage.style.display = "none";
      }, 3000);
  }
}

// Initialize the linked list
const workoutList = new WorkoutLinkedList();

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("workout-form");
  const workoutListElement = document.getElementById("workout-list");

  document.getElementById("add-workout").addEventListener("click", function(event) {
      event.preventDefault();

      const exercise = document.getElementById("workout-type").value;
      const duration = document.getElementById("duration").value;
      const calories = document.getElementById("calories-burned").value;
      const date = document.getElementById("date").value;

      if (!exercise.trim() || duration <= 0 || calories <= 0 || !date) {
          workoutList.displayFeedback("Please enter valid workout details.", "error");
          return;
      }

      workoutList.addWorkout(exercise, duration, calories, date);

      form.reset();
  });

  document.getElementById("sort-workout").addEventListener("click", function() {
      workoutList.sortByDate();
  });
});
/*--------------------------------------------Workout Plan END--------------------------------------------------- */



/*--------------------------------------------Goal Tracking Start--------------------------------------------------- */
function toggleInputFields() {
    const goalType = document.getElementById('goalType').value;
    const inputFields = document.getElementById('inputFields');
    if (goalType === 'loss' || goalType === 'gain') {
        inputFields.style.display = 'block';
    } else {
        inputFields.style.display = 'none';
    }
}

function calculate() {
    const goalType = document.getElementById('goalType').value;
    if (goalType === 'loss' || goalType === 'gain') {
        const currentWeight = parseFloat(document.getElementById('currentWeight').value);
        const goalWeight = parseFloat(document.getElementById('goalWeight').value);
        const timeInterval = parseFloat(document.getElementById('timeInterval').value);

        if (isNaN(currentWeight) || isNaN(goalWeight) || isNaN(timeInterval)) {
            displayErrorMessage("Please fill in all fields.");
            return;
        }
        if(currentWeight<10 || goalWeight<10 || timeInterval<0)
        {
            displayErrorMessage("Please enter a valid number.");
        }
        else if ((currentWeight>10 && goalWeight>10) && (timeInterval<3 && Math.abs(goalWeight-currentWeight)>5))
        {
            displayErrorMessage("Sorry, It can't be possible! It will take some time have patience.");
        }
        else{
            if (goalType === 'loss' && currentWeight <= goalWeight) {
            displayErrorMessage("Error: Goal weight should be less than current weight for weight loss.");
            } else if (goalType === 'gain' && currentWeight >= goalWeight) {
                displayErrorMessage("Error: Goal weight should be greater than current weight for weight gain.");
            } else {
                const calorieIntake = calculateCalorieIntake(goalType, currentWeight, goalWeight, timeInterval);
                displayResult(calorieIntake);
            }
        }

    }
}

function calculateCalorieIntake(goalType, currentWeight, goalWeight, timeInterval) {
    // Assuming a realistic weight change of 0.5 kg per week
    const weightChangePerWeek = goalType === 'loss' ? -0.5 : 0.5;
    const totalWeightChange = (goalWeight - currentWeight);
    const totalWeeks = timeInterval;
    const totalCalories = totalWeightChange * 7700 * (1 / weightChangePerWeek); // 7700 calories per kg
    const calorieIntakePerWeek = totalCalories / totalWeeks;
    return Math.round(calorieIntakePerWeek);
}

function displayResult(calorieIntake) {
    const resultElement = document.getElementById('result');
    resultElement.style.display = 'block';
    resultElement.classList.remove('error');
    resultElement.innerHTML = `To achieve your goal, you need to ${calorieIntake > 0 ? 'consume' : 'burn'} approximately ${Math.abs(calorieIntake)} calories per day.`;
}

function displayErrorMessage(message) {
    const resultElement = document.getElementById('result');
    resultElement.style.display = 'block';
    resultElement.classList.add('error');
    resultElement.innerHTML = message;
}
function generateWorkoutRecommendation(goalType, currentWeight, goalWeight) {
    let workoutRecommendation = '';

    if (goalType === 'loss') {
        workoutRecommendation = "For weight loss, focus on incorporating a combination of cardio exercises such as running, cycling, or HIIT (High-Intensity Interval Training), along with strength training exercises such as weightlifting or bodyweight exercises. Aim for at least 150 minutes of moderate-intensity cardio or 75 minutes of high-intensity cardio per week, coupled with 2-3 days of strength training targeting major muscle groups.";
    } else if (goalType === 'gain') {
        workoutRecommendation = "For weight gain, prioritize strength training exercises such as weightlifting, bodyweight exercises, and resistance training. Aim for 3-5 days of strength training per week, focusing on compound exercises that target multiple muscle groups. Gradually increase the weight and intensity of your workouts to stimulate muscle growth.";
    }

    return workoutRecommendation;
}

function generateNutritionRecommendation(goalType, currentWeight, goalWeight) {
    const proteinPerKg = 1.2; // Recommended protein intake per kg of body weight
    const fatPercentage = goalType === 'loss' ? 0.25 : 0.3; // Percentage of daily calories from fat
    const carbPercentage = 1 - fatPercentage - (proteinPerKg * currentWeight / 1000 * 4) / (goalWeight * 4); // Remaining calories from carbs

    const proteinIntake = Math.round(proteinPerKg * goalWeight);
    const fatIntake = Math.round(fatPercentage * (goalWeight * 9));
    const carbIntake = Math.round(carbPercentage * (goalWeight * 4));

    return {
        protein: proteinIntake,
        fat: fatIntake,
        carbs: carbIntake
    };
}

function displayRecommendations() {
    const goalType = document.getElementById('goalType').value;
    const currentWeight = parseFloat(document.getElementById('currentWeight').value);
    const goalWeight = parseFloat(document.getElementById('goalWeight').value);

    const workoutRecommendation = generateWorkoutRecommendation(goalType, currentWeight, goalWeight);
    const nutritionRecommendation = generateNutritionRecommendation(goalType, currentWeight, goalWeight);

    document.getElementById('workoutRecommendations').innerHTML = `<h3>Workout Recommendation:</h3><p>${workoutRecommendation}</p>`;
    document.getElementById('nutritionRecommendations').innerHTML = `<h3>Nutrition Recommendation:</h3><p>Protein: ${nutritionRecommendation.protein}g/day, Fat: ${nutritionRecommendation.fat}g/day, Carbs: ${nutritionRecommendation.carbs}g/day</p>`;

    document.getElementById('recommendationsSection').style.display = 'block';
}

/*--------------------------------------------Goal Tracking END--------------------------------------------------- */

