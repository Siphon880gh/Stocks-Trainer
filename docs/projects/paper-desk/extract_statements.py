import json,datetime as dt
CIKS={"AAPL":"0000320193","MSFT":"0000789019","AMZN":"0001018724"}
def days(a,b): return (dt.date.fromisoformat(b)-dt.date.fromisoformat(a)).days
CONCEPTS={"revenue":["RevenueFromContractWithCustomerExcludingAssessedTax","Revenues"],"grossProfit":["GrossProfit"],"operatingIncome":["OperatingIncomeLoss"],"netIncome":["NetIncomeLoss"],"epsDiluted":["EarningsPerShareDiluted"],
 "operatingCashFlow":["NetCashProvidedByUsedInOperatingActivities"],"capex":["PaymentsToAcquirePropertyPlantAndEquipment","PaymentsToAcquireProductiveAssets"],
 "cash":["CashAndCashEquivalentsAtCarryingValue"],"totalAssets":["Assets"],"totalLiabilities":["Liabilities"],"equity":["StockholdersEquity"]}
FLOW={"revenue","grossProfit","operatingIncome","netIncome","epsDiluted"}
CF={"operatingCashFlow","capex"}
res={}
for t,c in CIKS.items():
    f=json.load(open(f"facts_{c}.json"))["facts"]["us-gaap"]
    sub=json.load(open(f"sub_{c}.json"))["filings"]["recent"]
    filings=[(sub["filingDate"][i],sub["form"][i],sub["accessionNumber"][i],sub["reportDate"][i],sub["primaryDocument"][i]) for i in range(len(sub["form"])) if sub["form"][i] in("10-Q","10-K") and "2023-09-01"<=sub["filingDate"][i]<="2024-12-31"]
    out=[]
    for fd,form,acc,rep,doc in sorted(filings):
        row={"form":form,"filed":fd,"periodEnd":rep,"accession":acc,"url":f"https://www.sec.gov/Archives/edgar/data/{int(c)}/{acc.replace('-','')}/{doc}","values":{}}
        for k,names in CONCEPTS.items():
            for n in names:
                if n not in f: continue
                units=f[n]["units"]; u=units.get("USD") or units.get("USD/shares")
                cand=[x for x in u if x["accn"]==acc and x["end"]==rep]
                if k in FLOW:
                    want=(80,100) if form=="10-Q" else (350,380)
                    cand=[x for x in cand if "start" in x and want[0]<=days(x["start"],x["end"])<=want[1]]
                elif k in CF:
                    cand=[x for x in cand if "start" in x and (form=="10-K" or days(x["start"],x["end"])<350)]
                    cand.sort(key=lambda x:-days(x["start"],x["end"]))
                if cand:
                    x=cand[0]; row["values"][k]=x["val"]
                    if k in CF: row["cashFlowMonths"]=round(days(x["start"],x["end"])/30.4)
                    if k in FLOW: row["periodStart"]=x["start"]
                    break
        v=row["values"]
        if "totalLiabilities" not in v and "totalAssets" in v and "equity" in v:
            v["totalLiabilities"]=v["totalAssets"]-v["equity"]; row["liabilitiesDerived"]=True
        out.append(row)
    res[t]=out
    for r in out: print(t,r["form"],r["filed"],r["periodEnd"],r.get("periodStart"),r.get("cashFlowMonths"),r["values"])
json.dump(res,open("fin.json","w"),indent=1)
