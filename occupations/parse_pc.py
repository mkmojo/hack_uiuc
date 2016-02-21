
import csv
import json
def main():
    pairs = {}
    pairfile = open('pairs.csv', 'w')
    with open('pc.csv') as mapfile:
        reader = csv.DictReader(mapfile)
        for row in reader:
            try:
                occ = int(row['occ'])
                occ_sp = int(row['occ_sp'])
                count = int(row['total'])
                if (occ, occ_sp) not in pairs:
                    pairs[(occ, occ_sp)] = count
                else:
                    pairs[(occ, occ_sp)] += count
            except:
                pass

    occupations = {}
    for elem in pairs:
        occ = elem[0]
        occ_sp = elem[1]
        count = pairs[elem]
        if occ not in occupations:
            occupations[occ] = []
        else:
            occupations[occ].append( { 'count': int(count), 'occ_spouse': occ_sp} )

    for occ in occupations:
        occupations[occ].sort()
        occupations[occ] = occupations[occ][-10:]

    pairfile.write(json.dumps(occupations, sort_keys = True, indent = 4, separators = (',', ': ')))

    pairfile.close()


main()
