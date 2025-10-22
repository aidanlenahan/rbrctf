#!/bin/bash

# Array of salt quotes
quotes=(
"Just another grain of salt!"
"Dude, why are you looking at grains of salt?"
"Grain of salt"
"Just some salt"
"Why did the salt go to therapy? Because it couldn't stop feeling salty!"
"What's a salt's favorite exercise? The salt raise!"
"What did the salt say to the pepper at the party? You're looking seasoned tonight!"
"When salt goes to school, what does it study? Sodium!"
"I tried to tell a joke about salt, but it was too grainy for the crowd."
"Don't get annoyed, just take this with a grain of salt."
"I know you're upset, just refrain from using salty language."
)

# Number of grains
num_grains=1000
num_quotes=${#quotes[@]}

# Loop to create files
for ((i=1; i<=num_grains; i++)); do
    quote_index=$(( (i-1) % num_quotes ))
    echo "${quotes[$quote_index]}" > "grain_of_salt_$i"
done
