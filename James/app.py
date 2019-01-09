import pandas as pd
import numpy as np
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)


import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine


# engine = create_engine('sqlite:///aid_data.sqlite', echo=False)
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///aid_data.sqlite"
# db = SQLAlchemy(app)

# # reflect an existing database into a new model
# Base = automap_base()
# # reflect the tables
# Base.prepare(db.engine, reflect=True)

# # Save references to each table
# aid_data = Base.classes.aid_data


# session = Session(engine)

# our_data=[]
# for row in session.query(aid_data.country_name, aid_data.fiscal_year,  aid_data.constant_amount).all():
#     our_data.append(row)
# our_data_df0=pd.DataFrame(our_data)

# our_data_groupby=our_data_df0.groupby(['country_name','fiscal_year'])["constant_amount"].sum()
# our_data_df=our_data_groupby.reset_index()



our_data_df0=pd.read_csv("./simple_data.csv")
our_data_df=our_data_df0[["country_name",  "fiscal_year" , "constant_amount"]]
print(our_data_df.head())



@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")




countries=pd.read_csv("./country_name.csv")


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

    # # Use Pandas to perform the sql query
    # stmt = db.session.query(Samples).statement
    # df = pd.read_sql_query(stmt, db.session.bind)

    # # Return a list of the column names (sample names)
    # return jsonify(list(df.columns)[2:])
    country_data=our_data_df.loc[our_data_df["country_name"]==country]

    year_data=[]
    for index, row in country_data.iterrows():
        year_data.append({"country_name":country, "fiscal_year": row["fiscal_year"],"constant_amount": row["constant_amount"]})
    return jsonify(year_data)


    # data = {
    #     # "country": country,
    #     "year": country_data["fiscal_year"].values.tolist(),
    #     "amount": country_data.constant_amount.tolist()
    # }
    # print(data)
    # return jsonify(data)

if __name__ == "__main__":
    app.run()

