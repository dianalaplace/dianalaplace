export const knowledgeBase = [
  // ─── ALGORITHMS ──────────────────────────────────────────────────────────
  {
    id: 1,
    subject: 'Algorithms',
    title: 'Asymptotic Notations (O, Ω, Θ)',
    content: `Big-O: upper bound (at most). f=O(g): f grows no faster than g.
Big-Ω: lower bound (at least). f=Ω(g): f grows at least as fast as g.
Big-Θ: tight bound. f=Θ(g): BOTH f=O(g) AND f=Ω(g).

Complexity order (fast → slow):
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)

Formal definition of O:
  f = O(g) iff ∃ c>0, n₀ such that f(n) ≤ c·g(n) ∀ n≥n₀`,
  },
  {
    id: 2,
    subject: 'Algorithms',
    title: 'Master Theorem',
    content: `T(n) = a·T(n/b) + f(n),  a≥1, b>1

Let crit = n^(log_b(a))

Case 1: f(n) = O(n^(log_b(a)−ε))  →  T(n) = Θ(n^(log_b(a)))
Case 2: f(n) = Θ(n^(log_b(a)))    →  T(n) = Θ(n^(log_b(a)) · log n)
Case 3: f(n) = Ω(n^(log_b(a)+ε)) →  T(n) = Θ(f(n))

Examples:
  T(n)=2T(n/2)+n   → Case 2 → Θ(n log n)  [Merge Sort]
  T(n)=100T(n/10)+n → a=100,b=10 → crit=n² → Case 1 → Θ(n²)
  T(n)=T(n/3)+T(2n/3)+n → NOT directly Master Theorem → Θ(n log n) by recursion tree`,
  },
  {
    id: 3,
    subject: 'Algorithms',
    title: 'Data Structures Complexity',
    content: `Array:
  access O(1),  search O(n),  insert/delete O(n)

Singly Linked List:
  access O(n),  insert-head O(1),  search O(n)
  delete with pointer to node O(n)  ← need predecessor

Doubly Linked List:
  delete with pointer to node O(1)  ← prev+next directly accessible

Stack / Queue:
  push, pop, enqueue, dequeue: all O(1)

Binary Search Tree:
  search/insert/delete: O(log n) average, O(n) worst (degenerate)

MaxHeap:
  insert O(log n),  extract-max O(log n),  build-heap (bottom-up) O(n)

Hash Table:
  get/set: O(1) average, O(n) worst (all keys collide)`,
  },
  {
    id: 4,
    subject: 'Algorithms',
    title: 'BST & Heap',
    content: `Binary Search Tree insertion rule:
  left child < parent ≤ right child
  Compare from root: go left if smaller, right if larger.
  First element inserted = root.

Bottom-up MaxHeap (heapify):
  Start from last non-leaf (index ⌊n/2⌋), sift down.
  O(n) — most nodes near leaves, few swaps needed.
  Better than n insertions which is O(n log n).

MaxHeap property: parent ≥ children (always).
  Root is always the maximum.`,
  },
  {
    id: 5,
    subject: 'Algorithms',
    title: 'Sorting Algorithms',
    content: `Radix Sort (LSD):
  Sort digit-by-digit from least significant to most significant.
  Each pass uses a STABLE sort (Bucket/Counting Sort).
  Stability is essential — without it, prior-digit ordering breaks.
  Complexity: O(d·n) where d = number of digits.

Merge Sort:  O(n log n) — divide and conquer, stable.
Quick Sort:  O(n log n) avg, O(n²) worst — in-place, not stable.
Heap Sort:   O(n log n) — not stable.
Insertion:   O(n²) worst, O(n) best (nearly sorted).`,
  },
  {
    id: 6,
    subject: 'Algorithms',
    title: 'String Matching — Rabin-Karp',
    content: `Rabin-Karp algorithm:
  Uses hashing to match pattern P (length m) in text T (length n).

Rolling hash — key insight:
  After computing hash of T[0..m-1], slide the window:
    remove leftmost char contribution
    add new rightmost char
  Each slide = O(1)  →  O(n) total hashing.

Hash of "abcde" with base d, modulus q:
  hash = (a·d^(m-1) + b·d^(m-2) + ... + e) mod q
  New hash = (old_hash - T[i]·d^(m-1)) · d + T[i+m]  mod q

Complexity:
  Average: O(n + m)
  Worst (many hash collisions): O(nm)`,
  },
  {
    id: 7,
    subject: 'Algorithms',
    title: 'Recursion',
    content: `Three essential components of direct recursion:
  1. Base case     — stops the recursion
  2. Recursive call — calls itself with a smaller/simpler input
  3. Progress       — each call must move toward the base case

Without all three → infinite recursion or incorrect result.

Example — factorial:
  base: n=0 → return 1
  recursive: return n * fact(n-1)
  progress: n decreases by 1 each call`,
  },

  // ─── ML / PYTORCH ─────────────────────────────────────────────────────────
  {
    id: 8,
    subject: 'ML',
    title: 'PyTorch nn.Module Cheatsheet',
    content: `Template:
  class MyNet(nn.Module):
    def __init__(self):
      super().__init__()
      self.fc = nn.Linear(64, 10)
    def forward(self, x):
      return self.fc(x)

Training loop:
  optimizer.zero_grad()
  output = model(x)
  loss = criterion(output, target)
  loss.backward()
  optimizer.step()

model(x)  →  calls __call__  →  calls forward(x)
No forward() defined  →  NotImplementedError

Auto-registered parameters:
  ✓  nn.Parameter
  ✓  submodule's parameters (nn.Linear, etc.)
  ✗  plain torch.Tensor (not registered)`,
  },
  {
    id: 9,
    subject: 'ML',
    title: 'TorchScript: Tracing vs Scripting',
    content: `Tracing  (torch.jit.trace):
  Records ONE execution path.
  ✗ Loses if/else branches, loops — only one path captured.
  ✓ Works for simple sequential models.

Scripting  (torch.jit.script):
  Parses Python code directly.
  ✓ Preserves control flow (branches, loops).
  ✗ Fails if return types are inconsistent (int vs Tensor).

When to use each:
  → Simple sequential model: tracing.
  → Dynamic control flow: scripting.
  → Type inconsistency (returns 0 vs tensor): tracing only.

Every TorchScript program is valid Python, but not vice versa.`,
  },
  {
    id: 10,
    subject: 'ML',
    title: 'CNN Shapes & Operations',
    content: `Convolution output size:
  out = ⌊(W − F + 2P) / S⌋ + 1
  W=input size, F=filter size, P=padding, S=stride
  Example: 9×9, 3×3 kernel, stride 1, no padding → (9-3)/1+1 = 7×7

Max pooling:
  Take max in each non-overlapping window.
  2×2 pool, stride 2 halves the spatial dimensions.

Linear layer: nn.Linear(in, out)
  Input (batch, in) → Output (batch, out)
  Batch dimension always preserved.

Receptive field:
  The region of the input that influences one output neuron.
  Grows with network depth (stacked conv layers).`,
  },
  {
    id: 11,
    subject: 'ML',
    title: 'CNN Architecture Concepts',
    content: `Weight sharing:
  Same filter applied across all spatial positions → fewer parameters.

Local structure:
  CNNs exploit that nearby pixels are correlated.

Residual (skip) connections:
  y = F(x) + x
  Gradient shortcut: ∂L/∂x gets F'(x)+1 → prevents vanishing gradient.
  Enables training very deep networks (ResNet).

Batch normalization:
  Normalizes activations per mini-batch during training.
  Stabilizes training, allows higher learning rates.
  Applied after linear/conv layers, before activation.

Dropout:
  Randomly zeros neurons during training (probability p).
  Disabled during inference. Reduces overfitting.`,
  },
  {
    id: 12,
    subject: 'ML',
    title: 'Bias-Variance & Regularization',
    content: `Underfitting = HIGH BIAS:
  Low train accuracy, low test accuracy.
  Model too simple to capture the pattern.
  Fix: more complex model, more features, less regularization.

Overfitting = HIGH VARIANCE:
  High train accuracy, low test accuracy.
  Model memorizes training data including noise.
  Fix: more data, dropout, L1/L2 reg, early stopping, augmentation.

Regularization methods:
  L1 (lasso)   — sparsity, feature selection
  L2 (ridge)   — weight decay, penalizes large weights
  Dropout      — randomly drops neurons during training
  Early stopping — halt training when validation loss stops improving
  Data augmentation — artificially expand training set

Normalization constants:
  ALWAYS compute mean/std from TRAINING set only.
  Apply same constants to val and test → avoids data leakage.`,
  },
  {
    id: 13,
    subject: 'ML',
    title: 'Data, Features & Preprocessing',
    content: `Dimensionality:
  = number of features per sample.
  Tabular: columns = features. dim = number of columns.
  RGB image W×H: dim = W × H × 3.

One-hot encoding:
  Vocabulary [cat, dog, wolf, cow], "cow" at index 3:
  → (0, 0, 0, 1)
  Each word = vector of 0s with a single 1.

i.i.d. (independently and identically distributed):
  Core assumption in ML: samples are drawn from the same
  distribution and are mutually independent.

Train/Val/Test split:
  Training: model learns (ERM = minimize empirical risk).
  Validation: hyperparameter tuning, early stopping.
  Test: one-time evaluation of generalization.
  Never use test set during development!`,
  },
  {
    id: 14,
    subject: 'ML',
    title: 'Activation Functions & Loss',
    content: `Sigmoid (logistic): σ(x) = 1/(1+e^-x)
  Range: (0, 1).  Non-linear.  Used in logistic regression.
  Derivative: σ(x)(1−σ(x)).

ReLU: f(x) = max(0, x)
  Leaves positive values unchanged. Sets negative values to 0.
  No saturation for positive values → preferred in deep nets.

Softmax: normalizes logits to probabilities summing to 1.
  For >2 classes. Prediction = argmax(softmax output).
  Output (0.1, 0.45, 0.34, 0.11) → predict class 2.

Loss functions:
  MSE: for regression. L = (ŷ − y)².
  Cross-entropy: for classification. L = −Σ y_i log(ŷ_i).
  Lower loss = better prediction (not reversed).`,
  },
  {
    id: 15,
    subject: 'ML',
    title: 'Supervised vs Unsupervised Learning',
    content: `Supervised learning:
  Labeled data: (x, y) pairs. Learn f(x) → y.
  Models: Linear regression, Logistic regression,
          Random Forest, k-NN, SVM, Neural Networks.

Unsupervised learning:
  No labels. Find structure in data.
  Models: k-means (clustering), PCA, Autoencoders, t-SNE.

k-means: needs fixed k (number of clusters) as input.
k-NN: supervised — uses labeled training samples.

Classification: target y is a class label (can be integer-encoded).
Regression: target y is a continuous value.

ERM (Empirical Risk Minimization):
  Minimize average loss on training data.
  Test set estimates generalization risk.`,
  },

  // ─── MATH 1 ───────────────────────────────────────────────────────────────
  {
    id: 16,
    subject: 'Math1',
    title: 'Proof Techniques & Functions',
    content: `Mathematical Induction:
  1. Base case:          verify P(1) is true
  2. Inductive hypothesis: assume P(k) is true
  3. Inductive step:     prove P(k+1) follows from P(k)
  Conclude P(n) true for all n ∈ ℕ.

Function properties:
  Injective (1-to-1): f(a)=f(b) ⟹ a=b.  Each output ≤1 input.
  Surjective (onto):  ∀y ∈ codomain, ∃x: f(x)=y.
  Bijective:          injective + surjective → has inverse.

ReLU f(x)=max(0,x):
  NOT injective: f(−1)=f(−2)=0.
  NOT surjective onto ℝ: negative values never output.
  IS surjective as f: ℝ→[0,∞).`,
  },
  {
    id: 17,
    subject: 'Math1',
    title: 'Linear Systems — Gaussian Elimination',
    content: `Goal: solve Ax = b.

Steps:
  1. Form augmented matrix [A | b].
  2. Apply row operations to reach row echelon form.
  3. Back-substitute.

Possible outcomes:
  Unique solution:        last non-zero row has form [0...0 a | c], a≠0.
  Infinitely many:        free variable(s) appear — underdetermined system.
  No solution:            row of form [0...0 0 | c], c≠0 — contradiction.

Row operations (don't change solution set):
  Rᵢ ↔ Rⱼ       swap rows
  Rᵢ ← c·Rᵢ     scale row (c≠0)
  Rᵢ ← Rᵢ + c·Rⱼ  row combination`,
  },

  // ─── MATH 2 ───────────────────────────────────────────────────────────────
  {
    id: 18,
    subject: 'Math2',
    title: 'Limits & L\'Hôpital\'s Rule',
    content: `L'Hôpital's Rule:
  Apply when limit gives 0/0 or ∞/∞ form.
  lim f(x)/g(x) = lim f'(x)/g'(x)
  Can apply repeatedly.

Indeterminate forms and transformations:
  0·∞  →  rewrite as 0/(1/∞) or ∞/(1/0)
  ∞−∞  →  common denominator or other algebra
  Then apply L'Hôpital.

Key examples:
  lim_{x→0} (eˣ−x−1)/x²   →  apply twice  →  1/2
  lim_{x→0⁺} x/ln(x)      →  0/(−∞) = 0  (direct, no L'Hôpital)
  lim_{x→1⁻} x/ln(x)      →  1/0⁻ = −∞
  lim_{x→1⁺} x/ln(x)      →  1/0⁺ = +∞

f(x) = x/ln(x):
  Domain: (0,1) ∪ (1,∞)  [need x>0 and ln(x)≠0]
  lim_{x→0⁺} = 0,  lim_{x→1±} = ±∞,  lim_{x→∞} = +∞`,
  },
  {
    id: 19,
    subject: 'Math2',
    title: 'Derivatives & Extrema',
    content: `Finding local extrema:
  1. Compute f'(x). Set f'(x)=0 → critical points.
  2. First derivative test: sign change of f'.
     f' changes + → − at x₀: local MAX.
     f' changes − → + at x₀: local MIN.
  3. Second derivative test (if f'' exists):
     f''(x₀) < 0: local max.  f''(x₀) > 0: local min.

f(x) = x²e^(−x):
  f'(x) = xe^(−x)(2−x)
  Critical: x=0 (local min, f=0), x=2 (local max, f=4e⁻²).
  Global: as x→−∞, f→+∞ → no global min (goes to ∞).

Chain rule:   (f(g(x)))' = f'(g(x))·g'(x)
Product rule: (f·g)' = f'g + fg'
Quotient rule: (f/g)' = (f'g − fg')/g²`,
  },
  {
    id: 20,
    subject: 'Math2',
    title: 'Integration Techniques',
    content: `Integration by parts: ∫u dv = uv − ∫v du

LIATE rule — choose u as whichever comes first:
  L = Logarithmic  (ln x, log x)
  I = Inverse trig  (arctan x, arcsin x)
  A = Algebraic     (x², x, polynomials)
  T = Trigonometric (sin x, cos x)
  E = Exponential   (eˣ, aˣ)

Examples:
  ∫(x+1)eˣdx: u=x+1 (A), dv=eˣdx
    = (x+1)eˣ − ∫eˣdx = (x+1)eˣ − eˣ + C = xeˣ + C

  ∫x²e³ˣdx: u=x² (A), dv=e³ˣdx → apply IBP twice.

Substitution: ∫f(g(x))g'(x)dx = ∫f(u)du  (u=g(x))`,
  },
  {
    id: 21,
    subject: 'Math2',
    title: 'Taylor Series',
    content: `Taylor polynomial of order n around x₀=0 (Maclaurin):
  Tₙ(x) = Σₖ₌₀ⁿ f^(k)(0)/k! · xᵏ

Common series (all converge for all x ∈ ℝ):
  eˣ     = 1 + x + x²/2! + x³/3! + x⁴/4! + ...
  sin(x) = x − x³/3! + x⁵/5! − ...        (odd powers)
  cos(x) = 1 − x²/2! + x⁴/4! − ...        (even powers)
  sinh(x) = (eˣ−e^(−x))/2 = x + x³/3! + x⁵/5! + ...  (odd)
  cosh(x) = (eˣ+e^(−x))/2 = 1 + x²/2! + x⁴/4! + ...  (even)

sinh(ax):  T₄(x) = ax + a³x³/6
  (x⁰, x², x⁴ terms are 0 for odd functions)`,
  },
  {
    id: 22,
    subject: 'Math2',
    title: 'Linear Algebra — Eigenvalues & Positive Definite',
    content: `Eigenvalues: det(A − λI) = 0
  A = [[2,1],[1,2]]:
    (2−λ)²−1 = 0  →  λ=1 or λ=3.

Symmetric matrix A:
  All eigenvalues real.
  Eigenvectors for distinct eigenvalues are orthogonal.

Positive definite (PD): xᵀAx > 0 for all x≠0.
  Equivalent conditions:
    All eigenvalues > 0.
    Sylvester's criterion: all leading principal minors > 0.
    For 3×3: det(A₁₁)>0, det(A₂₂)>0, det(A)>0.

  A=[[1,2,0],[2,5,x−1],[0,x−1,1]] is PD iff 0 < x < 2.

SVD: A = UΣVᵀ
  Σ = diagonal matrix of singular values σᵢ = √λᵢ(AᵀA).`,
  },
  {
    id: 23,
    subject: 'Math2',
    title: 'Optimization — Lagrange Multipliers',
    content: `Constrained optimization:
  Minimize/maximize f(x,y) subject to g(x,y) = c.

Method of Lagrange multipliers:
  Solve the system:
    ∇f = λ∇g
    g(x,y) = c
  Evaluate f at all critical points. Compare to find global min/max.

Example: f(x,y) = ½x²y−2y on x²+y²=4 (circle radius 2):
  ∂f/∂x = xy = λ(2x)  →  x=0 or y=2λ
  ∂f/∂y = ½x²−2 = λ(2y)
  Critical points: (0,2) → f=−4, (0,−2) → f=4, (±2,0) → f=0.
  Global max = 4, global min = −4.

Unconstrained extrema:
  Interior: ∇f = 0 → check second-order conditions (Hessian).
  Boundary: use Lagrange or parametrize.`,
  },

  // ─── STATISTICS ───────────────────────────────────────────────────────────
  {
    id: 24,
    subject: 'Statistics',
    title: 'Hypothesis Testing',
    content: `General framework:
  H₀: null hypothesis (e.g., μ₁=μ₂, no difference)
  H₁: alternative hypothesis (e.g., μ₁≠μ₂)
  α: significance level (Type I error probability, typically 5%)

Type I error  (α): Reject H₀ when H₀ is TRUE  (false positive).
Type II error (β): Fail to reject H₀ when H₁ is TRUE (false negative).

Two-sample independent t-test:
  H₀: μ₁=μ₂,  H₁: μ₁≠μ₂
  t = (x̄₁−x̄₂) / √(s₁²/n₁ + s₂²/n₂)
  df ≈ n₁+n₂−2 (equal variance assumption)
  Reject H₀ if |t| > t_{α/2, df}  or  p-value < α.

Diet A vs B example: t = (4.31−2.84)/√(1.44/8+1.96/8) ≈ 2.26`,
  },
  {
    id: 25,
    subject: 'Statistics',
    title: 'Confidence Intervals',
    content: `CI for mean — unknown population variance (use t):
  x̄ ± t_{α/2, n−1} · (s/√n)

Key t-values:
  df=8,  95% CI:  t = 2.306
  df=∞,  95% CI:  z = 1.96
  df=14, 95% CI:  t = 2.145

Example: n=9, x̄=120ms, s=15ms, 95% CI:
  120 ± 2.306 · (15/3) = 120 ± 11.53 = [108.47, 131.53]

Interpretation:
  "We are 95% confident the true mean lies in this interval."
  NOT: "95% of observations fall here" (that's a prediction interval).`,
  },
  {
    id: 26,
    subject: 'Statistics',
    title: 'Probability Distributions',
    content: `Normal distribution N(μ, σ²):
  68-95-99.7 rule:
    P(μ−σ ≤ X ≤ μ+σ) ≈ 68.3%
    P(μ−2σ ≤ X ≤ μ+2σ) ≈ 95.4%
    P(μ−3σ ≤ X ≤ μ+3σ) ≈ 99.7%
  Height ~ N(160, 8²): P(152≤X≤168) = P(μ±σ) ≈ 68.3%

Poisson distribution:
  P(X=k) = e^(−λ) · λᵏ / k!
  Mean = Variance = λ
  Use: count of events in fixed time/space with rate λ.
  λ=10, k=9: P(X=9) = e^(−10)·10⁹/9! ≈ 0.1251

Binomial B(n,p):
  P(X=k) = C(n,k) · pᵏ · (1−p)^(n−k)
  Mean = np,  Variance = np(1−p)`,
  },
  {
    id: 27,
    subject: 'Statistics',
    title: 'Bayes\' Theorem',
    content: `P(A|B) = P(B|A)·P(A) / [P(B|A)·P(A) + P(B|Ā)·P(Ā)]

Components:
  P(A)    = prior probability
  P(B|A)  = likelihood / sensitivity
  P(B|Ā)  = false positive rate (FPR)
  P(A|B)  = posterior probability

Fraud detection example:
  P(fraud) = 4% = 0.04
  Sensitivity P(flag|fraud) = 90% = 0.90
  FPR P(flag|legit) = 2% = 0.02

  P(fraud|flag) = (0.90×0.04) / (0.90×0.04 + 0.02×0.96)
                = 0.036 / 0.0552 ≈ 65.2%

Note: even with 90% sensitivity, only 65% of flagged are fraud!
The LOW prior (4%) dilutes the result. Prior matters enormously.`,
  },
  {
    id: 28,
    subject: 'Statistics',
    title: 'Combinatorics',
    content: `Permutations (ordered arrangements):
  n distinct objects: n! ways.
  k of n objects: P(n,k) = n!/(n−k)!

Combinations (unordered selections):
  C(n,k) = n! / (k! · (n−k)!)

Constrained arrangements — keep groups together:
  Example: 4 fiction + 3 non-fiction, groups must stay together.
  Step 1: arrange 2 groups: 2! = 2 ways (fiction first or second)
  Step 2: arrange within fiction group: 4! = 24
  Step 3: arrange within non-fiction group: 3! = 6
  Total = 2 × 24 × 6 = 288

Multinomial: arrange n objects in groups of n₁, n₂, ..., nₖ:
  n! / (n₁! · n₂! · ... · nₖ!)`,
  },
]
