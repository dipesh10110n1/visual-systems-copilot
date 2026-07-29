from pydantic import BaseModel, Field
from typing import List


class Component(BaseModel):
    name: str
    type: str
    description: str


class Relationship(BaseModel):
    from_component: str
    to_component: str
    description: str


class Risk(BaseModel):
    severity: str
    title: str
    description: str


class Recommendation(BaseModel):
    title: str
    description: str


class AnalysisResponse(BaseModel):
    Summary: str
    Components: List[Component] = Field(default_factory=list)
    Relationships: List[Relationship] = Field(default_factory=list)
    Risks: List[Risk] = Field(default_factory=list)
    Recommendations: List[Recommendation] = Field(default_factory=list)
