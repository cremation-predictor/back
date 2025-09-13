# predict.py
import sys, json
import pandas as pd
import joblib

# 1. 입력 받기 (Node.js에서 전달)
args = json.loads(sys.argv[1])
year, month = args["year"], args["month"]

# 2. Pipeline 로드
pipeline = joblib.load("C:/moonlight_node/back/AI/model/Ridge_pipeline.pkl")

# 3. 원본 데이터 불러오기
df = pd.read_csv("C:/moonlight_node/back/AI/model/daegu_gyeongbuk_training_dataset_v6.csv")
df = df.drop(columns=["date", "region"])

# 4. 새로운 row 추가 (deaths_total은 None)
df_future = pd.concat([df, pd.DataFrame([{
    "year": year,
    "month": month,
    "deaths_total": None
}])], ignore_index=True)

# 5. 예측 실행
preds = pipeline.predict(df_future)
future_pred = int(preds[-1])  # 마지막 row 예측값

# 6. Node.js로 결과 반환
print(json.dumps({"prediction": future_pred}))
