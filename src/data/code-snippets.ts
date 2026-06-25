export interface CodeSnippet {
  title: string;
  description: string;
  language: string;
  filePath: string; // Repo-relative path for "View on GitHub" link
  code: string;     // Key excerpt from the actual file
}

// All code is verbatim from the actual source files — not paraphrased.
// DealStatus.java:   trms-domain/src/main/java/io/trms/domain/deal/DealStatus.java
// DealAgent.java:    trms-ai/src/main/java/io/trms/ai/agent/DealAgent.java
// HashChainService.java: trms-event-store/src/main/java/io/trms/eventstore/hash/HashChainService.java
export const codeSnippets: CodeSnippet[] = [
  {
    title: 'Sealed Deal Lifecycle — 11 States, Compiler-Enforced',
    description:
      'DealStatus is a sealed interface with one record per state. The compiler enforces exhaustive pattern-matching — no forgotten cases, no stringly-typed strings leaking into business logic.',
    language: 'java',
    filePath: 'trms-domain/src/main/java/io/trms/domain/deal/DealStatus.java',
    code: `public sealed interface DealStatus
        permits DealStatus.Draft, DealStatus.PendingReview, DealStatus.Confirmed,
                DealStatus.Settling, DealStatus.Settled, DealStatus.Accounted,
                DealStatus.Matured, DealStatus.Terminated, DealStatus.Rejected,
                DealStatus.Cancelled, DealStatus.ClosedOut {

    String value();

    static DealStatus fromString(String s) {
        return switch (s) {
            case "draft"          -> new Draft();
            case "pending_review" -> new PendingReview();
            case "confirmed"      -> new Confirmed();
            case "settling"       -> new Settling();
            case "settled"        -> new Settled();
            case "accounted"      -> new Accounted();
            case "matured"        -> new Matured();
            case "terminated"     -> new Terminated();
            case "rejected"       -> new Rejected();
            case "cancelled"      -> new Cancelled();
            case "closed_out"     -> new ClosedOut();
            default               -> throw new IllegalArgumentException("Unknown DealStatus: " + s);
        };
    }

    record Draft()        implements DealStatus { public String value() { return "draft"; } }
    record PendingReview() implements DealStatus { public String value() { return "pending_review"; } }
    record Confirmed()    implements DealStatus { public String value() { return "confirmed"; } }
    // ... 8 more states
}`,
  },
  {
    title: 'AI Deal Agent — Natural Language Trade Capture',
    description:
      'A Spring AI ChatClient agent that implements human-in-the-loop deal capture: gather terms, preview before booking, confirm before executing. Pure Java — no Python orchestration.',
    language: 'java',
    filePath: 'trms-ai/src/main/java/io/trms/ai/agent/DealAgent.java',
    code: `@Component
public class DealAgent {

    static final String SYSTEM_PROMPT = """
            You are a deal capture assistant for a Trading and Risk Management System.
            You help traders book financial deals. When capturing a deal, always show a preview first
            and ask for confirmation before executing. Available product types: swap, spot, forward,
            option, repo, deposit. Asset classes: rates, fx, credit, equity, money_market.

            Workflow for deal capture:
            1. Gather all required information from the user.
            2. Call captureDeal to generate a preview and confirmation token.
            3. Show the preview to the user and ask: "Shall I proceed with booking this deal?"
            4. Only call confirmCaptureDeal if the user explicitly confirms.
            """;

    public String chat(String userMessage) {
        return chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .user(userMessage)
                .call()
                .content();
    }
}`,
  },
  {
    title: 'SHA-256 Hash Chain — Tamper-Evident Event History',
    description:
      'Every event in the store is chained to its predecessor via SHA-256. Replaying the chain and comparing hashes reveals any insertion, deletion, or modification — making audit trail falsification cryptographically detectable.',
    language: 'java',
    filePath: 'trms-event-store/src/main/java/io/trms/eventstore/hash/HashChainService.java',
    code: `@Component
public class HashChainService {

    public static final String GENESIS_HASH =
            "0000000000000000000000000000000000000000000000000000000000000000";

    /** Computes SHA-256( previousHash + canonicalJson(payload) ) */
    public String computeHash(String previousHash, Object payload) {
        var canonical = canonicalJson(payload);
        var input = (previousHash + canonical).getBytes(StandardCharsets.UTF_8);
        return sha256Hex(input);
    }

    /** Verifies an entire ordered chain — returns broken position on tampering. */
    public HashVerificationResult verifyChain(List<Event> events) {
        var previousHash = GENESIS_HASH;
        for (int i = 0; i < events.size(); i++) {
            var event = events.get(i);
            var expectedHash = computeHash(previousHash, event.payload());
            if (!expectedHash.equals(event.hash())) {
                return HashVerificationResult.broken(i, event.version(), expectedHash, event.hash());
            }
            previousHash = event.hash();
        }
        return HashVerificationResult.ok(events.size());
    }
}`,
  },
];
