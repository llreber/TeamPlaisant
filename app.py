import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session, aliased
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################


app.config["SQLALCHEMY_DATABASE_URI"] =  "sqlite:///aid_data.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
aid = Base.classes.aid_data

#read the list of countries
countries=pd.read_csv("./country_name.csv")

session = Session(db.engine)

our_data=[]
for row in session.query(aid.country_name, aid.fiscal_year,  aid.constant_amount).all():
    our_data.append(row)
our_data_df0=pd.DataFrame(our_data)

our_data_groupby=our_data_df0.groupby(['country_name','fiscal_year'])["constant_amount"].sum()
our_data_df0=our_data_groupby.reset_index()

# our_data_df0=pd.read_csv("./simple_data.csv")

our_data_df=our_data_df0[["country_name",  "fiscal_year" , "constant_amount"]]
#print(our_data_df.head())




@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/map/<year>")
def map(year):
    #return the information by country for the year selected
    sel = [
        aid.country_name,
        aid.latitude,
        aid.longitude,
        aid.transaction_type_name,
        db.func.sum(aid.constant_amount),
        aid.fiscal_year        
    ]

    results = db.session.query(*sel).filter(aid.fiscal_year == year).filter(aid.transaction_type_name == "Obligations").group_by(aid.country_name, aid.fiscal_year, aid.transaction_type_name)

    # Create a dictionary entry for each row of information

    map_data = []
    for result in results:
        aid_dict = {}
        aid_dict["country"] = result[0]
        aid_dict["latitude"] = result[1]
        aid_dict["longitude"] = result[2]
        aid_dict["transaction type"] = result[3]
        aid_dict["amount"] = result[4]
        aid_dict["year"] = result[5]
        map_data.append(aid_dict)
        
    return jsonify(map_data)


data_bar_df=pd.read_csv("./us_foreign_aid_small.csv")
data123=data_bar_df[["year","category","amount"]].groupby(["year","category"]).sum().reset_index()

@app.route("/bar/<year>")
def bar(year):
   
    data0=data123[data123["year"]==year] 
    data0['amount']=data0['amount'].astype(str,inplace=True)

    print("data0=",data0)

    bar_data=[]
    for i in range(len(data0)):
        ss=data0.iloc[i]
        bar_data.append({"category":ss["category"],"amount":ss["amount"]  })

    print("bar_data=",bar_data)
    print(year)
    return jsonify(bar_data)

@app.route("/names")
def names():
    """Return the homepage."""
    country_list=[]
    for index, row in countries.iterrows():
        country_list.append({"country":row["country"]})
    return jsonify(country_list)

@app.route("/country/<country>")
def our_data(country):
    """Return a list of sample names."""
    country_data=our_data_df.loc[our_data_df["country_name"]==country]
    
    year_data=[]
    for index, row in country_data.iterrows():
        year_data.append({"country_name":country, "fiscal_year": row["fiscal_year"],"constant_amount": row["constant_amount"]})
    return jsonify(year_data)

if __name__ == "__main__":
    app.run()
