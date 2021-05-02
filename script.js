const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEL = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEL = document.getElementById('single-meal');


    //Search Meal Function

    function searchMeal(e){
        e.preventDefault();

        //Clear Single Meal 
        single_mealEL.innerHTML = '';

        // Get search value
        const term = search.value ;
        // Check for empty
        if(term.trim()){
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
              console.log(data);
              resultHeading.innerHTML = `<h2> Search results for '${term}' : </h2>`;

              if(data.meals === null){
                  resultHeading.innerHTML = "<p> There are no search results . Try again ! </p>"
              }else{
                  mealsEL.innerHTML = data.meals.map(meal => 
                    `<div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" /> 
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal} </h3>
                        </div>  
                    
                    </div>
                    `).join('');
              }
            });
            // Clear search text
            search.value = '';

        }else{
            alert('Please enter a search value');
        }

    }

    // Get Meal by ID 

    function get_meal_by_id(mealID){
        if(mealID){
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
            .then(res => res.json())
            .then(data => {
                const meal = data.meals[0];
                add_meal_to_dom(meal);
            });
        }
    }

    // add_meal_to_dom

    function add_meal_to_dom(meal){
        const ingredients = [];
        console.log(meal['strIngredient1']);
        for (let i = 1; i < 20; i++) {
           if (meal[`strIngredient${i}`]) {
             ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
           }else{
                break;
           }
        }
        single_mealEL.innerHTML = `
            <div class="single-meal">
                <h1>${meal.strMeal}</h1>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class='single-meal-info'>
                    ${meal.strCategory ? `<p> ${meal.strCategory} </p>` : "" }
                    ${meal.strArea ? `<p> ${meal.strArea} </p>` : "" }
                </div>
                <div class='main'>
                    <p>${meal.strInstructions} </p>
                    <h2> Ingredients </h2>
                    <ul>
                        ${ingredients.map(ingredient => `<li>${ingredient} </li>`).join('')}
                    </ul>
                </div>
            </div>
        `
    }
    //Get random meal 
    function get_random_meal(){
        // Clear meals and headings
        mealsEL.innerHTML='';
        resultHeading.innerHTML='';
        //Fetch from Api 
        fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            add_meal_to_dom(meal);
        });
    }


    //Event Listeners

    submit.addEventListener('submit',searchMeal);
    mealsEL.addEventListener('click',e=>{
        const mealInfo = e.path.find(item =>{
            if(item.classList){
                return item.classList.contains('meal-info')
            }else{
                return false;
            }
        });

        if(mealInfo){
            const mealID = mealInfo.getAttribute('data-mealid');
            $meal_details = get_meal_by_id(mealID);
        }

    });

    random.addEventListener('click',get_random_meal);



