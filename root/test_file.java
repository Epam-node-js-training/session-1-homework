class TestClass {
  private int testInt;
  private String testString;
  
  public TestClass(int i, String s) {
    this.testInt = i;
    this.testString = s;
  }
  
  public void setTestInt(int i) {
    this.testInt = i;
  }
  
  public void setTestString(String s) {
    this.testString = s;
  }
  
  public int getTestInt() {
    return this.testInt;
  }
  
  public String getTestString() {
    return this.testString;
  }
  
}
