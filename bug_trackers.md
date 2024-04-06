# TODO:
- Make sure this can't crash
- If the user overflow the display with number, just have it hidden on the left side
- remove console.log
- Decide if I want to see past calculation
- - Have the past calculation in a div element nearby and append to it!
- - CE only clears the display div
- - AC clears all
- Putting the check upon user input may push me to the edge of my JS

# Bugs list
- Pressing the following sequence will result in undefined:
    6-6=07-6
    - Fix: when calculating, if the first character is 0, remove it