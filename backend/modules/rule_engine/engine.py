"""
Versioned Legal Metrology Rule Engine Dispatcher
Allows selecting statutory rule set version (2011, 2022, 2024.1) and executing compliance checks dynamically.
"""

from typing import Dict, Any, List
from backend.core.config import settings
from backend.modules.rule_engine.rules_v2011 import LegalMetrologyRules2011
from backend.modules.rule_engine.rules_v2022 import LegalMetrologyRules2022
from backend.modules.rule_engine.rules_v2024 import LegalMetrologyRules2024


class RuleEngineDispatcher:
    """Unified Versioned Rule Engine for Legal Metrology Packaged Commodities Rules."""

    VERSION_REGISTRY = {
        "2011": LegalMetrologyRules2011,
        "2022": LegalMetrologyRules2022,
        "2024": LegalMetrologyRules2024,
        "2024.1": LegalMetrologyRules2024
    }

    def __init__(self, version: str = None):
        self.version = version or settings.ACTIVE_RULE_VERSION
        self.engine_class = self.VERSION_REGISTRY.get(self.version, LegalMetrologyRules2024)

    def evaluate_compliance(self, declarations: Dict[str, Any], measurements: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Runs compliance evaluation using configured version class."""
        result = self.engine_class.evaluate_rules(declarations, measurements)
        result["active_version"] = self.version
        result["supported_versions"] = list(self.VERSION_REGISTRY.keys())
        return result
