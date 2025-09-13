# ==============================
# 0. 환경 설정
# ==============================
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import RidgeCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import FunctionTransformer
import joblib

# ==============================
# 1. 데이터 불러오기
# ==============================
df = pd.read_csv("../data/daegu_gyeongbuk_training_dataset_v6.csv")
df = df.drop(columns=["date", "region"])

# ==============================
# 2. 전처리 함수 정의
# ==============================
def preprocess(df):
    df = df.copy()

    # 🔹 월 주기 변환
    df["month_sin"] = np.sin(2*np.pi*df["month"]/12)
    df["month_cos"] = np.cos(2*np.pi*df["month"]/12)

    # 🔹 Lag, Rolling, Diff
    df["deaths_total_lag1"] = df["deaths_total"].shift(1)
    df["deaths_total_lag12"] = df["deaths_total"].shift(12)
    df["deaths_rolling3"] = df["deaths_total"].shift(1).rolling(3).mean()
    df["deaths_diff1"] = df["deaths_total"].diff(1).shift(1)

    # 🔹 타겟 제거
    if "deaths_total" in df.columns:
        X = df.drop(columns=["deaths_total"])
    else:
        X = df

    return X.fillna(0)

# ==============================
# 3. Train/Test Split
# ==============================
data = df.dropna()
X = preprocess(data)
y = data["deaths_total"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, shuffle=False
)

# ==============================
# 4. Pipeline 정의 + 학습
# ==============================
pipeline = Pipeline([
    ("preprocess", FunctionTransformer(preprocess, validate=False)),
    ("model", RidgeCV(alphas=np.logspace(-3, 3, 20), cv=5))
])

pipeline.fit(data, y)   # 전체 데이터로 학습

# ==============================
# 5. Pipeline 저장
# ==============================
joblib.dump(pipeline, "Ridge_pipeline.pkl")
print("✅ Pipeline 저장 완료: Ridge_pipeline.pkl")
joblib.dump(pipeline, "Ridge_pipeline.pkl")
