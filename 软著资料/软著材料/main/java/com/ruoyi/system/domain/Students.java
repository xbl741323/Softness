package com.ruoyi.system.domain;

import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 学生对象 students
 * 
 * @author ruoyi
 * @date 2023-08-25
 */
public class Students extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 学生ID */
    private Long studentId;

    /** 学生名字 */
    @Excel(name = "学生名字")
    private String firstName;

    /** 学生姓氏 */
    @Excel(name = "学生姓氏")
    private String lastName;

    /** 学生性别 */
    @Excel(name = "学生性别")
    private String gender;

    /** 出生日期 */
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Excel(name = "出生日期", width = 30, dateFormat = "yyyy-MM-dd")
    private Date dateOfBirth;

    /** 家庭地址 */
    @Excel(name = "家庭地址")
    private String address;

    /** 联系电话 */
    @Excel(name = "联系电话")
    private String phoneNumber;

    /** 电子邮件 */
    @Excel(name = "电子邮件")
    private String email;

    /** 国籍 */
    @Excel(name = "国籍")
    private String nationality;

    /** 监护人姓名 */
    @Excel(name = "监护人姓名")
    private String guardianName;

    /** 监护人联系电话 */
    @Excel(name = "监护人联系电话")
    private String guardianPhoneNumber;

    /** 入学日期 */
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Excel(name = "入学日期", width = 30, dateFormat = "yyyy-MM-dd")
    private Date admissionDate;

    /** 毕业日期 */
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Excel(name = "毕业日期", width = 30, dateFormat = "yyyy-MM-dd")
    private Date graduationDate;

    /** 所属院系 */
    @Excel(name = "所属院系")
    private String department;

    /** 所属专业 */
    @Excel(name = "所属专业")
    private String major;

    /** 班级名称 */
    @Excel(name = "班级名称")
    private String className;

    /** 学籍状态 */
    @Excel(name = "学籍状态")
    private String enrollmentStatus;

    /** 学术导师 */
    @Excel(name = "学术导师")
    private String academicAdvisor;

    /** 宿舍号 */
    @Excel(name = "宿舍号")
    private String dormitoryNumber;

    /** 紧急联系人姓名 */
    @Excel(name = "紧急联系人姓名")
    private String emergencyContactName;

    /** 紧急联系人电话 */
    @Excel(name = "紧急联系人电话")
    private String emergencyContactNumber;

    public void setStudentId(Long studentId) 
    {
        this.studentId = studentId;
    }

    public Long getStudentId() 
    {
        return studentId;
    }
    public void setFirstName(String firstName) 
    {
        this.firstName = firstName;
    }

    public String getFirstName() 
    {
        return firstName;
    }
    public void setLastName(String lastName) 
    {
        this.lastName = lastName;
    }

    public String getLastName() 
    {
        return lastName;
    }
    public void setGender(String gender) 
    {
        this.gender = gender;
    }

    public String getGender() 
    {
        return gender;
    }
    public void setDateOfBirth(Date dateOfBirth) 
    {
        this.dateOfBirth = dateOfBirth;
    }

    public Date getDateOfBirth() 
    {
        return dateOfBirth;
    }
    public void setAddress(String address) 
    {
        this.address = address;
    }

    public String getAddress() 
    {
        return address;
    }
    public void setPhoneNumber(String phoneNumber) 
    {
        this.phoneNumber = phoneNumber;
    }

    public String getPhoneNumber() 
    {
        return phoneNumber;
    }
    public void setEmail(String email) 
    {
        this.email = email;
    }

    public String getEmail() 
    {
        return email;
    }
    public void setNationality(String nationality) 
    {
        this.nationality = nationality;
    }

    public String getNationality() 
    {
        return nationality;
    }
    public void setGuardianName(String guardianName) 
    {
        this.guardianName = guardianName;
    }

    public String getGuardianName() 
    {
        return guardianName;
    }
    public void setGuardianPhoneNumber(String guardianPhoneNumber) 
    {
        this.guardianPhoneNumber = guardianPhoneNumber;
    }

    public String getGuardianPhoneNumber() 
    {
        return guardianPhoneNumber;
    }
    public void setAdmissionDate(Date admissionDate) 
    {
        this.admissionDate = admissionDate;
    }

    public Date getAdmissionDate() 
    {
        return admissionDate;
    }
    public void setGraduationDate(Date graduationDate) 
    {
        this.graduationDate = graduationDate;
    }

    public Date getGraduationDate() 
    {
        return graduationDate;
    }
    public void setDepartment(String department) 
    {
        this.department = department;
    }

    public String getDepartment() 
    {
        return department;
    }
    public void setMajor(String major) 
    {
        this.major = major;
    }

    public String getMajor() 
    {
        return major;
    }
    public void setClassName(String className) 
    {
        this.className = className;
    }

    public String getClassName() 
    {
        return className;
    }
    public void setEnrollmentStatus(String enrollmentStatus) 
    {
        this.enrollmentStatus = enrollmentStatus;
    }

    public String getEnrollmentStatus() 
    {
        return enrollmentStatus;
    }
    public void setAcademicAdvisor(String academicAdvisor) 
    {
        this.academicAdvisor = academicAdvisor;
    }

    public String getAcademicAdvisor() 
    {
        return academicAdvisor;
    }
    public void setDormitoryNumber(String dormitoryNumber) 
    {
        this.dormitoryNumber = dormitoryNumber;
    }

    public String getDormitoryNumber() 
    {
        return dormitoryNumber;
    }
    public void setEmergencyContactName(String emergencyContactName) 
    {
        this.emergencyContactName = emergencyContactName;
    }

    public String getEmergencyContactName() 
    {
        return emergencyContactName;
    }
    public void setEmergencyContactNumber(String emergencyContactNumber) 
    {
        this.emergencyContactNumber = emergencyContactNumber;
    }

    public String getEmergencyContactNumber() 
    {
        return emergencyContactNumber;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
            .append("studentId", getStudentId())
            .append("firstName", getFirstName())
            .append("lastName", getLastName())
            .append("gender", getGender())
            .append("dateOfBirth", getDateOfBirth())
            .append("address", getAddress())
            .append("phoneNumber", getPhoneNumber())
            .append("email", getEmail())
            .append("nationality", getNationality())
            .append("guardianName", getGuardianName())
            .append("guardianPhoneNumber", getGuardianPhoneNumber())
            .append("admissionDate", getAdmissionDate())
            .append("graduationDate", getGraduationDate())
            .append("department", getDepartment())
            .append("major", getMajor())
            .append("className", getClassName())
            .append("enrollmentStatus", getEnrollmentStatus())
            .append("academicAdvisor", getAcademicAdvisor())
            .append("dormitoryNumber", getDormitoryNumber())
            .append("emergencyContactName", getEmergencyContactName())
            .append("emergencyContactNumber", getEmergencyContactNumber())
            .toString();
    }
}
