package lib

import (
	"fmt"
	"slices"
	"strings"
)

func GenLabels() map[string][]string {
	labels := make(map[string][]string)

	labels["1"] = []string{"aiav", "boko", "dandy", "dldss", "emois", "fadss", "fcdss", "fsdss", "fsvss", "ftav", "iene", "kire", "kkbt", "kmhr", "kmhrs", "kuse", "mgold", "mist", "mogi", "moon", "msfh", "mtall", "namh", "nhdt", "nhdta", "nhdtb", "noskn", "open", "piyo", "rct", "rctd", "sace", "sdab", "sdam", "sdde", "sdhs", "sdjs", "sdmf", "sdmm", "sdms", "sdmt", "sdmu", "sdmua", "sdnm", "sdth", "senn", "setm", "seth", "sgki", "shyn", "silk", "silks", "silku", "sply", "star", "stars", "start", "stzy", "sun", "suwk", "svbgr", "svcao", "svdvd", "svmgm", "svnnp", "svsha", "svvrt", "sw", "wo"}
	labels["2"] = []string{"cen", "ckw", "cwm", "dfdm", "dfe", "dje", "ecb", "ekai", "emsk", "hkw", "wdi", "wsp", "wss", "wzen"}
	labels["13"] = []string{"dsvr"}
	labels["18"] = []string{"sprd"}
	labels["24"] = []string{"bld", "cvd", "dkd", "frd", "isrd", "nad", "nhd", "ped", "tyd", "ufd", "vdd"}
	labels["41"] = []string{"aibv", "aidv", "hodv", "howy"}
	labels["53"] = []string{"dv"}
	labels["55"] = []string{"csct", "hitma", "hsrm", "id", "qqq", "qvrt", "t", "tsms"}
	labels["59"] = []string{"hez"}
	labels["118"] = []string{"aas", "abf", "abp", "abw", "aka", "bgn", "chn", "dic", "dmr", "dkn", "dlv", "fbu", "fig", "fit", "fiv", "gni", "gdl", "ggg", "jbs", "onez", "ppt", "ppx", "pxh", "sga", "shf", "sng", "thu", "yrk"}
	labels["5433"] = []string{"btha"}
	labels["5642"] = []string{"neob"}
	labels["h_019"] = []string{"aczd"}
	labels["h_066"] = []string{"fax"}
	labels["h_068"] = []string{"mxbd", "mxgs", "mxsps"}
	labels["h_086"] = []string{"hone", "hthd", "iora", "iro", "jrzd", "jrze", "jura", "nuka"}
	labels["h_113"] = []string{"cb", "ps", "se", "sy", "zm"}
	labels["h_139"] = []string{"dhld", "doks", "dotm"}
	labels["h_172"] = []string{"gghx", "hmgl", "hmnf"}
	labels["h_237"] = []string{"ambi", "clot", "find", "hdka", "nacr", "nacx", "zmar"}
	labels["h_346"] = []string{"rebd", "rebdb"}
	labels["h_458"] = []string{"hsm"}
	labels["h_491"] = []string{"fneo", "fone", "tenn", "tkou"}
	labels["h_720"] = []string{"zex"}
	labels["h_796"] = []string{"san"}
	labels["h_910"] = []string{"vrtm"}
	labels["h_1100"] = []string{"hzgd"}
	labels["h_1127"] = []string{"gopj"}
	labels["h_1133"] = []string{"gone", "jstk", "nine", "tdan"}
	labels["h_1240"] = []string{"milk"}
	labels["h_1324"] = []string{"skmj"}
	labels["h_1350"] = []string{"kamef", "kamx", "tmgv", "vov", "vovx"}
	labels["h_1472"] = []string{"xox"}
	labels["h_1495"] = []string{"bank"}
	labels["h_1539"] = []string{"slr"}
	labels["h_1615"] = []string{"beaf"}
	labels["h_1711"] = []string{"dal", "docd", "docp", "hmrk", "maan", "mfcd", "mfct", "mgtd"}
	labels["h_1712"] = []string{"asi", "dtt", "fft", "kbi", "kbl", "kbr", "tuk"}
	labels["h_1757"] = []string{"olm"}
	labels["h_1800"] = []string{"yyds"}
	labels["n_707"] = []string{"aims", "fuka", "jfic", "jtdk", "lbdd", "mbdd", "ohp"}
	labels["n_709"] = []string{"maraa", "mbraa", "mbrau", "mbraz", "mbrba", "mbrbi", "mbrbm", "mbrbn", "mmraa"}
	labels["n_1428"] = []string{"ap", "ld", "ss"}

	return labels
}

func GetPosterLinkFromSN(sn string) string {
	labels := GenLabels()
	slice := strings.Split(strings.ToLower(sn), "-")
	dmmMonoPics := "https://p.dmm.co.jp/mono/movie/adult"
	id := fmt.Sprintf("%s%s", slice[0], slice[1])

	for key, value := range labels {
		if slices.Contains(value, slice[0]) {
			return fmt.Sprintf("%s/%s/%spl.jpg", dmmMonoPics, key+id, key+id)
		}
	}

	return fmt.Sprintf("%s/%s/%spl.jpg", dmmMonoPics, id, id)
}
