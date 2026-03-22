# (list)

marks1 = 94.4              # Marks[0] , marks[2].... so on
marks2 = 76.4
marks3 = 76.7

marks = [96.4 , 64.6 , 76.9]
print(marks)
print(type(marks))
print(marks[0])
print(marks[1])

student = ["karan", 76.8, 16, "Delhi"]       # STUDENT[0], Student[1],......So On
print(student[0])
student[0] = "arjun"
print(student)


       # LIST SLICINGH
marks = [87, 97, 98, 99, 100]
print(marks[1:4])
print(marks[ :5])
print(marks[-3:-2])

# LIST METHOD 

list = [2,3,4,5]

list.append(6)             # list.append(6)  // add one element the end [1,2,3,4,]
print(list)
print(list.append(6))         # their is nothig return from this list but adding element (6)

print(list.sort())       # nothing return from list
print(list)                                                     # sort in ascending order


print(list.sort(reverse =True))    # list.sort(revers = True)// sort in descending order
print(list)


list = ['a','b','r']
print(list.sort(reverse = True))
print(list)               # OR
list.reverse()                    # list.revers()// revers list[3,4,5,]
print(list)


list = [2,3,3,4,5,]
list.insert(1, 5)         # list.insert(index, element)// insert element at index 
print(list)

list.insert(2, 6)
print(list)


list.remove(3)         # list.remove()// remove first occurcence of element[2,3,4]
print(list)

list = [8,9,0,4,6]
list.remove(9)
print(list)

list.pop(0)
print(list)



# TUPLES #

tuple = (87,86,98,65,)
print(type(tuple))

tuple = ()
print(tuple)
print(type(tuple))

tuple = (1)
print(tuple)
print(type(tuple))

tuple = (1.7)
print(tuple)
print(type(tuple))

tuple = ("hello world")
print(tuple)
print(type(tuple))

tuple = (8,5,6,7,2,)
print(tuple[1:6])
print(tuple[0:])
print(tuple[:6])

  # Tuple method
tuple = (5,2,3,2,4,5)
print(tuple.index(2))   # tuple.index(el)// Return indexof first occurrence   [tuple].index(5) is 1]

print(tuple.count(2))           # tuple.cont(element)// count total occurrences   [tuple.count(5) is 2]
print(tuple.count(5))
 

# Wap to ask the user to enter names of 3 favorite movie & store them in a list

movies = []
mov1 = input("enet 1st movie:")
mov2 = input("enter 2nd movie:")
mov3 = input("eneter 3rd movie:")

movies.append(mov1)
movies.append(mov2)
movies.append(mov3)

print(movies)       # OR METHOD 2

movies = []
mov = input("enter 1st movie:")
movies.append(mov)
mov = input("enter 2nd movie:")
movies.append(mov)
mov = input("enter 3rd movie:")
movies.append(mov)

print(movies)   
  

#Wap to check if a list a contains a palindrome of element (use copy() method)
list1 = [1,2,1]
list2 = [2,3,4]
copy_list1 = list1.copy()
copy_list1.revers()

if(copy_list1 == list):
       print("palindrome")
else:
       print("NOT palindrome")







