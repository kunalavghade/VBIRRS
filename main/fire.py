import firebase_admin
from firebase_admin import credentials
from firebase_admin import db


if not firebase_admin._apps:
    cred = credentials.Certificate("./FireBase/serviceAccountKey.json")
    firebase_admin.initialize_app(
        cred, {"databaseURL": "https://database-1c96e-default-rtdb.firebaseio.com/"}
    )

database =  db.reference('/')

def createuser(name):
    user_ref = database.child("users")
    user_ref.update({name: ["None"]})


def update_user(name, data):
    user_ref = database.child("users")
    pre = user_ref.child(name).get()
    print(pre)
    if pre is None:
        return 
    if pre == ['None']:
        pre = [data]
    elif data in pre:
        pre.remove(data)
    pre.insert(0,data)
    user_ref.update({name: pre})

def get_recipe(veggies,name):
    veggies = list(map(str.lower,veggies))
    permute = []
    def per(arr, tmp, idx):
        for i in range(idx,len(arr)):
            permute.append(tmp+arr[i])
            if i+1<len(arr):
                per(arr,tmp+arr[i]+'-', i+1)
    per(veggies,"", 0)
    
    data = db.reference('/Recipes').get()

    if data == None:
        return {}

    tmp = {}
    for key in permute:
        if key in data:
            tmp.update(data[key])

    recipe = {}

    user_ref = database.child("users")
    pre = user_ref.child(name).get()

    if (pre is not None) and (pre != ['None']):
        while pre :
            recipe[pre.pop()] = []

    while len(tmp) != 0:
        v, k = tmp.popitem();
        if k not in recipe:
            recipe[k] = []
        recipe[k].append(v)

    tmp = []
    for k,v in recipe.items():
        if not v:
            tmp.append(k);

    while tmp:
        recipe.pop(tmp.pop())

    return recipe
