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


if __name__ == "__main__":
    app.run()
