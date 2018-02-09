#!/usr/bin/env python
# Name: Nadja van 't Hoff
# Student number: 11030720
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # find all shows
    shows = dom.find_all('div', {'class':'lister-item-content'})

    # initiate list to store data
    rows = []

    # iterate through shows, collecting data
    for show in shows:

        # collect titles and check if data is available
        title = show.h3.a.string
        if not title:
            title = 'missing data'

        # collect ratings and check if data is available
        rating = show.div.div.strong.string
        if not rating:
            rating = 'missing data'

        # collect genre and check if data is available
        genres = show.find_all('span', {'class':'genre'})[0].text.strip()
        if not genres:
            genres = 'missing data'
        genre = '"' + genres + '"'

        # collect runtime and check if data is available
        runtime = show.find_all('span', {'class':'runtime'})[0].text
        if not runtime:
            time = 'missing data'
        else:
            time,minutes = runtime.split(' ')

        # iterate through stars to find actors
        stars = show.find_all('p', {'class':''})[1].find_all('a')
        actors_list = []
        for star in stars:
            actor = star.text
            # check if data is available
            if not actor:
                actor = 'missing data'
            actors_list.append(actor)
        actors = '"' + ','.join(actors_list) + '"'

        # add show as string to list
        serie = ','.join([title, rating, genre, actors, time])
        rows.append([serie])

    return[rows]


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # iterate through series to write data to csv-file
    for serie in tvseries:
        writer.writerows(serie)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)