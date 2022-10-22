import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

from services.shared_service import figure_to_uri, log

#################################################################

CAT_INDEXES = ["Count","Unique","Top","Frequency"]
CONT_INDEXES = ["Count","Mean","Standard deviation","Minimum","25th percentile","50th percentile","75th percentile","Max"]

#################################################################

def get_stat_indicators(df):

    #columns with numeric values
    continuous = df.select_dtypes(include='number')

    log(continuous, "continuous: ")

    if len(continuous.columns) > 0:
        continuous_described = continuous.describe().T.to_dict('split')

        continuous_described['columns'][0] = 'Available value count'
        continuous_described['columns'][2] = 'Standard deviation'
        continuous_described['columns'][4] = '25th percentile'
        continuous_described['columns'][5] = 'Median'
        continuous_described['columns'][6] = '75th percentile'
        
    else:
        continuous_described = []

    log(continuous_described, "continuous_described: ")

    #columns with non-numeric values
    categorical = df.select_dtypes(exclude='number')
    
    if len(categorical.columns) > 0:
        categorical_described = categorical.describe().T.to_dict('split')

        categorical_described['columns'][0] = 'Available value count'
        categorical_described['columns'][2] = 'Most common'
        categorical_described['columns'][3] = 'Occurrence of most common'
    else:
        categorical_described = []
    
    log(categorical_described, "categorical_described: ")

    stat_indicators = {}

    stat_indicators["continuous"] = continuous_described
    stat_indicators["categorical"] = categorical_described

    return stat_indicators

# # #

def get_corr_matrix(df, diagonal=False):
    mask = None
    corr = df.corr()

    sns.set_theme(style="white")
    #sns.set(font_scale=0.5)
    
    if diagonal:
        # Generate a mask for the upper triangle
        mask = np.triu(corr)

        np.fill_diagonal(mask, False)

    # Set up the matplotlib figure
    figure, ax = plt.subplots(figsize=(12, 9))
    figure.set_tight_layout(True)

    # Generate a custom diverging colormap
    cmap = "Spectral" #sns.diverging_palette(230, 20, as_cmap=True)

    # Draw the heatmap with the mask and correct aspect ratio
    heatmap = sns.heatmap(corr, mask=mask, cmap=cmap, center=0, annot=True,
        square=True, linewidths=.5, cbar_kws={"shrink": 1}, fmt='.5f')

    uri = figure_to_uri(figure)

    return uri
