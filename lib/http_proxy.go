package lib

import (
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"

	"github.com/PuerkitoBio/goquery"
	fiberlog "github.com/gofiber/fiber/v2/log"
)

func DoHttpProxyRequest(link string) (*http.Response, error) {
	proxyUrl, err := url.Parse(os.Getenv("HTTP_PROXY"))
	if err != nil {
		return nil, err
	}

	client := &http.Client{Transport: &http.Transport{Proxy: http.ProxyURL(proxyUrl)}}
	req, err := http.NewRequest("GET", link, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
	res, err := client.Do(req)
	fiberlog.Info(fmt.Sprintf("Do Http Request: %s", link))

	if err != nil {
		fiberlog.Error(fmt.Sprintf("Error Http Request with link %s: %s", link, err.Error()))
		return nil, err
	}
	return res, nil
}

func ParseDocument(link string) (VideoDetailedInfo, error) {
	res, err := DoHttpProxyRequest(link)
	if err != nil {
		return VideoDetailedInfo{}, err
	}

	defer res.Body.Close()

	Info := VideoDetailedInfo{}

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return VideoDetailedInfo{}, err
	}

	Info.Title = doc.Find("body > section > div > div.video-detail > h2 > strong.current-title").Text()

	detailedInfoSelection := doc.Find("body > section > div > div.video-detail > div.video-meta-panel > div > div:nth-child(2) > nav").Children()

	detailedInfoSelection.Each(func(i int, s *goquery.Selection) {
		switch s.Find("div > strong").Text() {
		case "番號:":
			Info.SerialNumber = s.Find("div>span").Text()
		case "日期:":
			Info.ReleaseDate, err = time.Parse("2006-01-02", s.Find("div>span.value").Text())
		case "時長:":
			Info.Duration, err = strconv.Atoi(s.Find("div>span").Text()[:3])
		case "導演:":
			Info.Director = s.Find("div>span>a").Text()
		case "片商:":
			Info.Publisher = s.Find("div>span>a").Text()
		case "系列:":
			Info.Series = s.Find("div>span>a").Text()
		case "評分:":
			Info.Rank = s.Find("div>span").Text()[2:6]
		case "類別:":
			s.Find("div>span.value>a").Each(func(ii int, ss *goquery.Selection) {
				Info.Tags = append(Info.Tags, ss.Text())
			})
		case "演員:":
			namelist, sexlist := []string{}, []string{}
			s.Find("div>span.value>a").Each(func(ii int, ss *goquery.Selection) {
				namelist = append(namelist, ss.Text())
			})
			s.Find("div>span.value>strong").Each(func(ii int, ss *goquery.Selection) {
				if ss.Text() == "♀" {
					sexlist = append(sexlist, "female")
				}
				if ss.Text() == "♂" {
					sexlist = append(sexlist, "male")
				}
			})
			for index, sex := range sexlist {
				if sex == "male" {
					Info.StarringInfo.Actors = append(Info.StarringInfo.Actors, namelist[index])
				}
				if sex == "female" {
					Info.StarringInfo.Actress = append(Info.StarringInfo.Actress, namelist[index])
				}
			}
		}
	})

	return Info, nil
}
