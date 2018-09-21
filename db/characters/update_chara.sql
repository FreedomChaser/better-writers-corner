update characters 
set first_name = $3, last_name =$4, gender = $5, hair_color = $6, eye_color = $7, hobby = $8, age = $9, occupation = $10, dd_alignment = $11, special_abilities = $12
-- values ($3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
where characterid = $2 and storyid = $1
