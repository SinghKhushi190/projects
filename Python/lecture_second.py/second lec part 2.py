#(Question)// Wap to check if a number entered by the user is odd or even 

num = int(input("enter any number:"))

if(num % 2 == 0):
    print("even")
else:
    print("odd")

#(question)//Wap to find the greatest of 3 number entered by the user

A = int(input("enter first number:"))
B = int(input("enter second number:"))
C = int(input("enter third number:"))

if(A >= B and A >= C):
    print(" first greatest number is",A)
elif(B >= C):
    print("second greatest number is", B)
else:
    print("third greatest number is", C)


#(question)//Wap to check if a number is a multiple of 7 or not

x = int(input("enter number:"))

if(x % 7 == 0):
    print("number is multiple of 7")
else:
    print("number is not multiple of 7")