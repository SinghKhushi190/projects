# first time coding in python 
print("hello world")
print("khushi singh")
str1 = "khushi"
len1 = len(str1)
str2 = "singh"
len2 = len(str2)
print(str1+str2)
final_str = str1+str2
print(final_str)
final_str = str1+""+str2
print(final_str)
print(len(final_str))


# INDEXING
str = "apna collage"
ch = str[2]
print(ch)
ch = str[5]
print(ch)

print(str[0:4])
print(str[:9])
print(str[0:])             #SLICING


# Operator in python
# Arithmetic operator
a = 10
b = 20

print(a+b)
print(a-b)
print(a*b)
print(a/b)
print(a % b) #Remainder
print(a ** b)  # a^b

#Relational operator
a = 50
b = 20

print(a==b)
print(a != b)
print(a >= b)
print(a <= b)
print(a < b)

#Assignement operator
num = 30
num += 10  #or num = num + 10
num = num + 10   # num = 30 +10 => 40
print(num)
print("num:", num)

# Logical operators
a = 40
b = 30
print(not False)
print(not(a > b))

val1 = True
val2 = False
print("and operator:", val1 and val2)

print("or operator:", val1 or val2)
print("or operator:", (a == b) or (a > b))

#Type conversion
a = 3
b = 30.78                                         # if we are add string with float their will give error in programming
                                                      # only float can add with float value in programming
print(a+b) # 3.0+ 30.78 => 33.78

# Type casting
a = int("2")
b = 3.98

print(type(a))
print(a + b)

a = float("2")
b = 3.98
print(type(a))
print(a + b)

# inputs in python
name =input(" enter your name:")
print("welcome", name)

val = input("enter some value:")
print(type(val), val)

name = input("enter name:")
age = int(input("enter age:"))
marks = float(input("enter marks:"))

print("welcome", name)
print("age =", age)
print("marks =", marks)


# practice Question
              # Write a program to input 2 number & print their sum

first = int(input("enter first number:"))
sec = int(input("enter sec number:"))

print = ("sum = ", first + sec)

# WAP to input side of a square & print its area
side = float(input("enter square side :"))

print("area =", side ** 2)





