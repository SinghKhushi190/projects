# STRING Function
str = "i am studying python from apnacollage"

print(str.endswith("am"))
print(str.endswith("age"))
print(str.endswith("ege"))                   #str.endswith("any words")// return true if stringends with substring
 

print(str.capitalize())                #str.capitalize()//capitalize 1st character
print(str)

print(str.replace("from", "fram"))              #str.replace(old, new)// Replace all occurrences of old eith new
print(str.replace("python", "java"))   

print(str.find("s"))              #str.find("word")// Return 1st index of 1st occurrence
print(str.find("a"))
print(str.find("from"))

print(str.count("am"))    #str.count("am")// count the occurence of substring in string
print(str.count("f"))
print(str.count("a"))

#(Question)//  Wap to input user's first name & print its length
name = input("enter your name:")
print("length of your name is", len(name))

#(Question)// Wap to find the occurence of '$' in a string
str = "Hii, $I am $ symbol $ 99.99"
print(str.count("$"))


#Conditional Statment

age = 16                          #(CASE--1ST)

if(age >= 18):
    print("can vote")
else:
    print("cannot vote")


    print("can vote")
    print("cannot vote")

#(CASE--2ND)

light = "green"

if(light =="red"):
    print("stop")
elif(light == "green"):
    print("go")
elif(light == "yellow"):
    print("look")

print("end of code")

#(CASE--3RD)

num = 5

if(num > 2):
    print("greater than 2")
if(num > 3):
    print("grater than 3")

    #ELSE CASE
    #(CASE--4TH)

    light = "pink"

    if(light == "green"):
        print("go")
    elif(light == "yellow"):
        print("look")
    elif(light == "red"):
        print("stop")
    else:
        print("light is broken")

        print("ends of code")

        age = 14           # else another case
        if(age >= 18):
            print("can vote")      # indentation (proper sapce after if & elif condition)
        else:
            print("cannot vote")



            #(Question)// Grade student based on marks 

            marks = int(input("enter student marks:"))

            if(marks >= 90):
                grade = "a"
            elif(marks >= 80 and marks < 90):
                grade = "b"
            elif(marks >= 70 and marks < 80):
                grade = "c"
            else:
                grade = "d"
                print("grade of student is", grade)


                
                    



