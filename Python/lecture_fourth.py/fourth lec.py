         # DICTIONARY
info ={
    "name" : "khushi singh",
    "subjects" : "coding",
     "age" : "19",
     "score" : "96.3",
     "is_adult" : True,
     
}
print(info)

information = {
    "subject" : ["python","java","c++"],
    "topics" :("dics","sets"),
    12.99 : 94.7
}
print(information)

print(information["subject"])
print(information["topics"])
print(information[12.99])

information["name"] = "apna"
information["surname"] = "collage"
print(information)

null_dict = {}
null_dict["name"] = "khushi singh"
print(null_dict)

student = {
    "name"  : "rohan kumar",
    "subject" : {
        "phy" : 78,
        "che" : 89,
        "math" : 90

    }
}

         # Nested dictionary
print(student)
print(student["subject"])
print(student["subject"]["che"])

            # Dictionary Method

print(student.keys())
print(list(student.keys()))                  # mydict.keys()// return all keys
print(len(student))
print(len(student.keys()))


print(student.values())
print(list(student.values()))           # mydict.values()// return all values
print(len(student.values()))


print(student.items())                                 # mydict.item()// return all (key, val) pairs as tuples
print(list(student.items()))
print(len(student.items()))

#print(student["name2"])    # Error 
print(student.get("name2"))
print(student.get("name"))                    # mydict.get("key")// return the key a/c to values
print(student.get("subject"))


student.update({"city" : "patna"})
print(student)
                                                                      # insert the specified items to the dictionary
new_dict = {"city" : "patna", "age" : "19" }
student.update(new_dict)
print(student) 


             #Set in python

collection = {1,2,3,4,5}
print(collection)
print(type(collection))

brand = {1,2,2,3,4,4,5,"hello","world","world"}              # set are ignore duplicate values (means repetative values)
print(brand)
print(len(brand))


      # Sets Methode
collection = set()
collection.add(1)                       #  Set.add(el)// add on element
collection.add(2)
collection.add("patna")
collection.add((1,2,3))

print(collection)


collection.remove(2)
print(collection)                                                         #Set.remove(el)// Remove the element
collection.remove("patna")
print(collection)


sets = set({"apnacollage", "coding", "python", "java"})         # set.clear()// empities the sets
sets.clear()

print(len(sets))

brand = {"add", "subs", "multi", "coding", "javascript"}  
print(brand.pop())                                                                          # Set.pop()//remove random values
print(brand.pop())


set1 = {1,2,3,4}  
set2 = {3,2,5,6} 

print(set1.union(set2))         # Set.union(set2)// combines both set values & return new

print(set1.intersection(set2))                                            # Set.intersection(set2)// combines common values & return new
print(len(set1))
print(len(set2))


                      # let's pratice
         # store following words meaning in a python dictionary:

dictionary = {
    "table" : ["a piece of furniture", "list of facts & figures"],
    "cat" : "a small animal"

}
print(dictionary)

    # you are given a list of subjects for students. assume one classroom is required for 1 subject.-
    # -how many classroom are needed by all students.


subjects = {
    "python", "java", "c++", "c", "python",
    "java", "c", "c++"
}
print(subjects)
print(len(subjects))

# {Question}
marks ={}

x = int(input("enter physics :"))
marks.update({"physics" : x})

x = int(input("enter maths :"))
marks.update({"maths" : x})

x = int(input("enter chem :"))
marks.update({"chem" : x})

print(marks)


# {Question}

values = {
    ("float", 90.0),
    ("int",9)
}
print(values)


  




